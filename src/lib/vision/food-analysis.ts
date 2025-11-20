import openai from './openai';
import type { 
  FoodAnalysisResult, 
  FoodItem,
  UserProfile 
} from './types/vision';

/**
 * Analisa uma imagem de alimento usando OpenAI Vision API
 * Detecta alimentos, calcula nutrientes e sugere alternativas saudáveis
 */
export async function analyzeFoodImage(
  imageBase64: string,
  userProfile?: UserProfile
): Promise<FoodAnalysisResult> {
  try {
    const prompt = `Você é um nutricionista especializado em análise visual de alimentos. Analise esta imagem de comida e retorne um JSON estruturado com as seguintes informações:

INSTRUÇÕES CRÍTICAS:
1. Identifique TODOS os alimentos visíveis na imagem
2. Para cada alimento, estime a porção em gramas/ml usando referências visuais (tamanho do prato, utensílios, mãos)
3. Calcule valores nutricionais precisos baseados em tabelas TACO/USDA
4. Diferencie preparações simples (arroz branco) de complexas (lasanha)
5. Considere o contexto visual para estimar quantidade com precisão
6. Sugira 3 alternativas mais saudáveis

${userProfile ? `PERFIL DO USUÁRIO:
- Objetivo: ${userProfile.goal}
- Peso: ${userProfile.weight}kg
- Altura: ${userProfile.height}cm
- Idade: ${userProfile.age} anos
- Sexo: ${userProfile.gender}
- Nível de atividade: ${userProfile.activityLevel}
` : ''}

RETORNE EXATAMENTE NESTE FORMATO JSON (sem markdown, sem explicações extras):
{
  "success": true,
  "alimentos": [
    {
      "name": "Nome do alimento",
      "description": "Descrição detalhada (tipo de preparo, aparência)",
      "portion": "Descrição da porção (ex: 1 xícara, 150g)",
      "portionGrams": 150,
      "calories": 200,
      "macros": {
        "protein": 25,
        "carbs": 30,
        "fats": 10
      },
      "micros": {
        "fiber": 5,
        "sugar": 2,
        "sodium": 300
      },
      "confidence": 0.95
    }
  ],
  "totals": {
    "calories": 500,
    "protein": 40,
    "carbs": 60,
    "fats": 15,
    "fiber": 8,
    "sugar": 5,
    "sodium": 800
  },
  "suggestions": [
    "Substitua o arroz branco por arroz integral para mais fibras",
    "Adicione mais vegetais para aumentar saciedade",
    "Reduza o óleo no preparo para diminuir calorias"
  ],
  "contextNotes": [
    "Prato de tamanho médio detectado",
    "Porções estimadas com base em referências visuais",
    "Preparação caseira identificada"
  ]
}

Se a imagem não contiver alimentos ou for inválida, retorne:
{
  "success": false,
  "error": "Descrição específica do problema (ex: 'Nenhum alimento detectado na imagem', 'Imagem muito escura para análise', 'Foto desfocada')",
  "alimentos": [],
  "totals": { "calories": 0, "protein": 0, "carbs": 0, "fats": 0, "fiber": 0, "sugar": 0, "sodium": 0 },
  "suggestions": [],
  "contextNotes": []
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.3, // Baixa temperatura para respostas mais precisas
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Remove markdown se presente
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result: FoodAnalysisResult = JSON.parse(jsonContent);

    return result;

  } catch (error) {
    console.error('Erro na análise de alimentos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao analisar imagem',
      alimentos: [],
      totals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      },
      suggestions: [],
      contextNotes: []
    };
  }
}

/**
 * Converte arquivo de imagem para base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
