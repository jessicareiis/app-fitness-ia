import openai from '../openai';
import type { 
  PersonalizedRecommendations,
  UserProfile,
  FoodItem,
  BodyAnalysisResult
} from '../types/vision';

/**
 * Gera recomendações personalizadas baseadas em análises de alimentos e corpo
 */
export async function generatePersonalizedRecommendations(
  userProfile: UserProfile,
  foodAnalysis?: FoodItem[],
  bodyAnalysis?: BodyAnalysisResult['analise_corporal']
): Promise<PersonalizedRecommendations> {
  try {
    const goalDescriptions = {
      emagrecimento: 'perder peso e reduzir gordura corporal',
      hipertrofia: 'ganhar massa muscular e força',
      saude: 'melhorar saúde geral e bem-estar'
    };

    const prompt = `Você é um coach de fitness e nutricionista. Crie um plano personalizado completo baseado nas informações abaixo:

PERFIL DO USUÁRIO:
- Peso: ${userProfile.weight}kg
- Altura: ${userProfile.height}cm
- Idade: ${userProfile.age} anos
- Sexo: ${userProfile.gender === 'male' ? 'Masculino' : 'Feminino'}
- Objetivo: ${goalDescriptions[userProfile.goal]}
- Nível de atividade: ${userProfile.activityLevel}

${foodAnalysis ? `ÚLTIMA REFEIÇÃO ANALISADA:
${foodAnalysis.map(food => `- ${food.name}: ${food.calories}kcal (P:${food.macros.protein}g C:${food.macros.carbs}g G:${food.macros.fats}g)`).join('\n')}
` : ''}

${bodyAnalysis ? `ANÁLISE CORPORAL ATUAL:
- Gordura corporal: ${bodyAnalysis.bodyFatPercentage}%
- Massa magra: ${bodyAnalysis.leanMass}kg
- IMC: ${bodyAnalysis.estimatedBMI}
- Postura: ${bodyAnalysis.posture.status}
` : ''}

RETORNE EXATAMENTE NESTE FORMATO JSON (sem markdown):
{
  "mealPlan": {
    "breakfast": [
      "3 ovos mexidos com espinafre (300 kcal)",
      "2 fatias de pão integral (140 kcal)",
      "1 banana média (105 kcal)",
      "Café preto sem açúcar"
    ],
    "lunch": [
      "150g de peito de frango grelhado (250 kcal)",
      "1 xícara de arroz integral (215 kcal)",
      "Salada verde à vontade com azeite (100 kcal)",
      "1 porção de brócolis no vapor (55 kcal)"
    ],
    "dinner": [
      "180g de salmão grelhado (360 kcal)",
      "200g de batata doce assada (180 kcal)",
      "Aspargos grelhados (40 kcal)"
    ],
    "snacks": [
      "30g de amêndoas (170 kcal)",
      "1 iogurte grego natural com frutas vermelhas (150 kcal)",
      "Whey protein (120 kcal)"
    ]
  },
  "shoppingList": [
    "Ovos (2 dúzias)",
    "Peito de frango (1kg)",
    "Salmão fresco (500g)",
    "Arroz integral (1kg)",
    "Batata doce (1kg)",
    "Espinafre fresco",
    "Brócolis",
    "Aspargos",
    "Banana",
    "Frutas vermelhas",
    "Amêndoas (200g)",
    "Iogurte grego natural",
    "Whey protein",
    "Pão integral",
    "Azeite extra virgem",
    "Temperos naturais"
  ],
  "workout": {
    "type": "Treino ${userProfile.goal === 'hipertrofia' ? 'de Hipertrofia' : userProfile.goal === 'emagrecimento' ? 'para Emagrecimento' : 'Funcional'}",
    "exercises": [
      {
        "name": "Supino reto",
        "sets": 4,
        "reps": "8-12",
        "rest": "90s"
      },
      {
        "name": "Remada curvada",
        "sets": 4,
        "reps": "8-12",
        "rest": "90s"
      },
      {
        "name": "Agachamento livre",
        "sets": 4,
        "reps": "10-15",
        "rest": "2min"
      },
      {
        "name": "Desenvolvimento militar",
        "sets": 3,
        "reps": "10-12",
        "rest": "90s"
      },
      {
        "name": "Rosca direta",
        "sets": 3,
        "reps": "12-15",
        "rest": "60s"
      }
    ],
    "duration": "60 minutos"
  },
  "motivationalTips": [
    "Consistência é mais importante que perfeição. Foque em melhorar 1% a cada dia!",
    "Durma pelo menos 7-8 horas por noite para otimizar recuperação e resultados",
    "Beba pelo menos 2.5L de água por dia para manter hidratação ideal",
    "Tire fotos semanais para acompanhar sua evolução visual",
    "Celebre pequenas vitórias - cada treino completo é uma conquista!"
  ]
}

IMPORTANTE:
- Ajuste calorias totais para o objetivo (déficit para emagrecimento, superávit para hipertrofia)
- Priorize alimentos integrais e nutritivos
- Inclua variedade para evitar monotonia
- Considere praticidade no dia a dia
- Treino deve ser adequado ao nível de condicionamento`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7, // Temperatura média para criatividade nas recomendações
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Remove markdown se presente
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result: PersonalizedRecommendations = JSON.parse(jsonContent);

    return result;

  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    
    // Retorna recomendações padrão em caso de erro
    return {
      mealPlan: {
        breakfast: [
          "3 ovos mexidos (210 kcal)",
          "2 fatias de pão integral (140 kcal)",
          "1 fruta (80 kcal)"
        ],
        lunch: [
          "150g de proteína magra (200 kcal)",
          "1 xícara de arroz integral (215 kcal)",
          "Salada verde (50 kcal)"
        ],
        dinner: [
          "150g de peixe ou frango (200 kcal)",
          "Vegetais variados (100 kcal)"
        ],
        snacks: [
          "Iogurte natural (120 kcal)",
          "Frutas (80 kcal)"
        ]
      },
      shoppingList: [
        "Ovos",
        "Peito de frango",
        "Peixe",
        "Arroz integral",
        "Vegetais variados",
        "Frutas",
        "Pão integral",
        "Iogurte natural"
      ],
      workout: {
        type: "Treino Funcional",
        exercises: [
          { name: "Agachamento", sets: 3, reps: "15", rest: "60s" },
          { name: "Flexão", sets: 3, reps: "12", rest: "60s" },
          { name: "Prancha", sets: 3, reps: "30s", rest: "45s" }
        ],
        duration: "30 minutos"
      },
      motivationalTips: [
        "Consistência é a chave do sucesso!",
        "Cada dia é uma nova oportunidade de melhorar",
        "Foque no progresso, não na perfeição"
      ]
    };
  }
}
