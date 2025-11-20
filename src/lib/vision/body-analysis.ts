import openai from '../openai';
import type { 
  BodyAnalysisResult,
  UserProfile 
} from '../types/vision';

/**
 * Analisa uma imagem corporal usando OpenAI Vision API
 * Detecta pontos anatômicos, estima composição corporal e avalia postura
 */
export async function analyzeBodyImage(
  imageBase64: string,
  userProfile?: UserProfile,
  previousAnalysis?: BodyAnalysisResult['analise_corporal']
): Promise<BodyAnalysisResult> {
  try {
    const prompt = `Você é um profissional de educação física e avaliação corporal. Analise esta foto corporal e retorne um JSON estruturado com as seguintes informações:

INSTRUÇÕES CRÍTICAS:
1. Identifique pontos anatômicos (ombros, cintura, quadril, peito, coxas, braços)
2. Estime percentual de gordura corporal baseado em características visuais
3. Calcule massa magra aproximada
4. Estime medidas corporais em centímetros
5. Avalie a postura e identifique problemas
6. Sugira correções posturais específicas
7. Se houver análise anterior, compare e mostre evolução

${userProfile ? `PERFIL DO USUÁRIO:
- Peso: ${userProfile.weight}kg
- Altura: ${userProfile.height}cm
- Idade: ${userProfile.age} anos
- Sexo: ${userProfile.gender}
- Objetivo: ${userProfile.goal}
` : ''}

${previousAnalysis ? `ANÁLISE ANTERIOR:
- Gordura corporal: ${previousAnalysis.bodyFatPercentage}%
- Massa magra: ${previousAnalysis.leanMass}kg
- Medidas anteriores: ${JSON.stringify(previousAnalysis.measurements)}
` : ''}

RETORNE EXATAMENTE NESTE FORMATO JSON (sem markdown, sem explicações extras):
{
  "success": true,
  "analise_corporal": {
    "bodyFatPercentage": 18.5,
    "leanMass": 62.5,
    "estimatedBMI": 23.4,
    "measurements": {
      "shoulders": 110,
      "chest": 95,
      "waist": 80,
      "hips": 95,
      "thighs": 55,
      "arms": 32
    },
    "posture": {
      "status": "good",
      "issues": ["Leve inclinação anterior dos ombros"],
      "corrections": [
        "Fortaleça os músculos das costas com remadas",
        "Alongue o peitoral diariamente",
        "Pratique exercícios de consciência postural"
      ]
    },
    "anatomicalPoints": {
      "detected": ["ombros", "cintura", "quadril", "peito", "coxas", "braços"],
      "confidence": 0.92
    }
  }${previousAnalysis ? `,
  "evolution": {
    "weightChange": -2.5,
    "bodyFatChange": -1.8,
    "measurementChanges": {
      "waist": -3,
      "arms": 1
    },
    "progressNotes": [
      "Redução significativa na circunferência da cintura",
      "Ganho de massa muscular nos braços",
      "Melhora visível na definição abdominal"
    ]
  }` : ''}
}

Se a imagem não for adequada para análise corporal, retorne:
{
  "success": false,
  "error": "Descrição específica do problema (ex: 'Corpo não visível na foto', 'Imagem muito escura', 'Ângulo inadequado para análise', 'Use foto de corpo inteiro')"
}

IMPORTANTE: 
- Para fotos de frente: foque em simetria, definição abdominal, desenvolvimento de peito/ombros
- Para fotos de costas: avalie desenvolvimento dorsal, simetria, postura
- Para fotos de lateral: avalie postura, curvatura da coluna, projeção abdominal
- Seja preciso mas realista nas estimativas
- Considere iluminação e ângulo na confiança da análise`;

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
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Remove markdown se presente
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result: BodyAnalysisResult = JSON.parse(jsonContent);

    return result;

  } catch (error) {
    console.error('Erro na análise corporal:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao analisar imagem',
      analise_corporal: {
        bodyFatPercentage: 0,
        leanMass: 0,
        estimatedBMI: 0,
        measurements: {
          shoulders: 0,
          chest: 0,
          waist: 0,
          hips: 0,
          thighs: 0,
          arms: 0
        },
        posture: {
          status: 'needs_improvement',
          issues: [],
          corrections: []
        },
        anatomicalPoints: {
          detected: [],
          confidence: 0
        }
      }
    };
  }
}
