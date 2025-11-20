import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não fornecida' },
        { status: 400 }
      );
    }

    // Calcular informações do usuário
    const calculateUserInfo = () => {
      const weight = parseFloat(userProfile.weight);
      const height = parseFloat(userProfile.height);
      const age = parseFloat(userProfile.age);
      
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

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

      return {
        bmi: bmi.toFixed(1),
        tmb: Math.round(tmb),
        dailyCalories: Math.round(dailyCalories)
      };
    };

    const userInfo = calculateUserInfo();

    const systemPrompt = `Você é um coach digital especializado em fitness e nutrição. Você está ajudando um usuário com o seguinte perfil:

- Peso: ${userProfile.weight}kg
- Altura: ${userProfile.height}cm
- Idade: ${userProfile.age} anos
- Sexo: ${userProfile.gender === 'male' ? 'Masculino' : 'Feminino'}
- Objetivo: ${userProfile.goal === 'lose' ? 'Perder peso' : userProfile.goal === 'gain' ? 'Ganhar massa muscular' : userProfile.goal === 'tone' ? 'Definir e tonificar' : 'Manter peso'}
- Peso desejado: ${userProfile.targetWeight}kg
- IMC atual: ${userInfo.bmi}
- TMB: ${userInfo.tmb} kcal
- Calorias diárias recomendadas: ${userInfo.dailyCalories} kcal

Seja motivador, profissional e forneça conselhos práticos e personalizados. Responda de forma clara e objetiva.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Últimas 10 mensagens para contexto
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0].message.content;

    return NextResponse.json({ response: assistantMessage });

  } catch (error: any) {
    console.error('Erro no chat do coach:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
