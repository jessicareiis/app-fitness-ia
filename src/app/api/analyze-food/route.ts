import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, userGoal } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Usar GPT-4o Vision para análise de alimentos
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Você é um nutricionista especializado. Analise esta foto de alimento e retorne APENAS um JSON válido (sem markdown, sem explicações extras) com a seguinte estrutura:

{
  "alimentos": [
    {
      "nome": "nome do alimento",
      "descricao": "breve descrição",
      "calorias": número,
      "proteinas": número em gramas,
      "carboidratos": número em gramas,
      "gorduras": número em gramas,
      "fibras": número em gramas,
      "acucar": número em gramas,
      "sodio": número em mg,
      "porcao": "estimativa em gramas ou ml",
      "alternativa_saudavel": "sugestão de alternativa mais saudável (opcional)"
    }
  ],
  "total_calorias": soma total,
  "total_proteinas": soma total,
  "total_carboidratos": soma total,
  "total_gorduras": soma total
}

Objetivo do usuário: ${userGoal === 'lose' ? 'Perder peso' : userGoal === 'gain' ? 'Ganhar massa muscular' : userGoal === 'tone' ? 'Definir e tonificar' : 'Manter peso'}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional, sem markdown (```json), sem explicações. Seja preciso nas estimativas usando bases de dados nutricionais confiáveis.`
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Não foi possível analisar a imagem' },
        { status: 500 }
      );
    }

    // Parse direto do JSON já que pedimos response_format json_object
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      // Fallback: tentar extrair JSON se vier com markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Resposta da API:', content);
        return NextResponse.json(
          { error: 'Formato de resposta inválido. Tente novamente.' },
          { status: 500 }
        );
      }
      result = JSON.parse(jsonMatch[0]);
    }

    // Validar estrutura mínima
    if (!result.alimentos || !Array.isArray(result.alimentos)) {
      console.error('Estrutura inválida:', result);
      return NextResponse.json(
        { error: 'Estrutura de dados inválida. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Erro na análise de alimentos:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar imagem' },
      { status: 500 }
    );
  }
}
