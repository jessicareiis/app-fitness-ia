import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, userProfile } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Usar GPT-4o Vision para análise corporal
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Você é um especialista em composição corporal e análise física. Analise esta foto do corpo e retorne APENAS um JSON válido (sem markdown, sem explicações extras) com a seguinte estrutura:

{
  "analise_corporal": {
    "percentual_gordura": "estimativa em %",
    "massa_magra": "estimativa em kg",
    "imc_estimado": "valor numérico",
    "classificacao": "classificação do IMC",
    "medidas": {
      "ombros": "estimativa em cm",
      "cintura": "estimativa em cm",
      "quadril": "estimativa em cm"
    },
    "postura": "análise da postura",
    "observacoes": "observações gerais sobre composição corporal"
  },
  "recomendacoes": {
    "plano_alimentar": "recomendação de plano alimentar",
    "treino_recomendado": "tipo de treino recomendado",
    "calorias_sugeridas": "faixa de calorias diárias"
  }
}

Dados do usuário:
- Peso: ${userProfile.weight}kg
- Altura: ${userProfile.height}cm
- Idade: ${userProfile.age} anos
- Sexo: ${userProfile.gender === 'male' ? 'Masculino' : 'Feminino'}
- Objetivo: ${userProfile.goal === 'lose' ? 'Perder peso' : userProfile.goal === 'gain' ? 'Ganhar massa muscular' : userProfile.goal === 'tone' ? 'Definir e tonificar' : 'Manter peso'}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional, sem markdown (```json), sem explicações. Seja profissional e preciso. Use os dados fornecidos para contextualizar a análise visual.`
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
    if (!result.analise_corporal) {
      console.error('Estrutura inválida:', result);
      return NextResponse.json(
        { error: 'Estrutura de dados inválida. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Erro na análise corporal:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar imagem' },
      { status: 500 }
    );
  }
}
