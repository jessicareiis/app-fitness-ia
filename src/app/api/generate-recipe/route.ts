import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { mealType, userProfile } = await request.json();

    if (!mealType) {
      return NextResponse.json(
        { error: 'Tipo de refeição não fornecido' },
        { status: 400 }
      );
    }

    // Calcular calorias recomendadas para a refeição
    const calculateMealCalories = () => {
      const weight = parseFloat(userProfile.weight);
      const height = parseFloat(userProfile.height);
      const age = parseFloat(userProfile.age);
      
      let tmb;
      if (userProfile.gender === "male") {
        tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      const activityFactor = 1.55;
      let dailyCalories = tmb * activityFactor;

      if (userProfile.goal === "lose") {
        dailyCalories -= 500;
      } else if (userProfile.goal === "gain") {
        dailyCalories += 300;
      }

      // Distribuição aproximada por refeição
      const distribution: any = {
        'Café da Manhã': 0.25,
        'Almoço': 0.35,
        'Lanche': 0.15,
        'Jantar': 0.25
      };

      return Math.round(dailyCalories * distribution[mealType]);
    };

    const targetCalories = calculateMealCalories();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um chef nutricionista especializado em criar receitas saudáveis e balanceadas.'
        },
        {
          role: 'user',
          content: `Crie uma receita de ${mealType} com aproximadamente ${targetCalories} calorias.

Objetivo do usuário: ${userProfile.goal === 'lose' ? 'Perder peso' : userProfile.goal === 'gain' ? 'Ganhar massa muscular' : userProfile.goal === 'tone' ? 'Definir e tonificar' : 'Manter peso'}

Retorne um JSON estruturado:
{
  "nome": "nome da receita",
  "descricao": "breve descrição",
  "calorias": número,
  "proteinas": número em gramas,
  "carboidratos": número em gramas,
  "gorduras": número em gramas,
  "tempo_preparo": "tempo estimado",
  "ingredientes": ["lista", "de", "ingredientes"],
  "modo_preparo": ["passo 1", "passo 2", "passo 3"],
  "dica": "dica especial do chef"
}

A receita deve ser:
- Saborosa e prática
- Adequada ao objetivo do usuário
- Com ingredientes acessíveis
- Balanceada nutricionalmente`
        }
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Não foi possível gerar a receita' },
        { status: 500 }
      );
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Formato de resposta inválido' },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Erro ao gerar receita:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar receita' },
      { status: 500 }
    );
  }
}
