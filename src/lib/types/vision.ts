// Tipos para reconhecimento de alimentos
export interface FoodItem {
  name: string;
  description: string;
  portion: string;
  portionGrams: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  micros: {
    fiber: number;
    sugar: number;
    sodium: number;
  };
  confidence: number;
}

export interface FoodAnalysisResult {
  success: boolean;
  error?: string;
  alimentos: FoodItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  suggestions: string[];
  contextNotes: string[];
}

// Tipos para análise corporal
export interface BodyMeasurements {
  shoulders: number;
  chest: number;
  waist: number;
  hips: number;
  thighs: number;
  arms: number;
}

export interface BodyAnalysisResult {
  success: boolean;
  error?: string;
  analise_corporal: {
    bodyFatPercentage: number;
    leanMass: number;
    estimatedBMI: number;
    measurements: BodyMeasurements;
    posture: {
      status: 'good' | 'needs_improvement' | 'poor';
      issues: string[];
      corrections: string[];
    };
    anatomicalPoints: {
      detected: string[];
      confidence: number;
    };
  };
  evolution?: {
    weightChange: number;
    bodyFatChange: number;
    measurementChanges: Partial<BodyMeasurements>;
    progressNotes: string[];
  };
}

// Tipos para recomendações personalizadas
export interface PersonalizedRecommendations {
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  shoppingList: string[];
  workout: {
    type: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }>;
    duration: string;
  };
  motivationalTips: string[];
}

export interface CompleteAnalysisResult {
  alimentos?: FoodItem[];
  analise_corporal?: BodyAnalysisResult['analise_corporal'];
  recomendacoes: PersonalizedRecommendations;
  timestamp: string;
}

// Tipo para objetivo do usuário
export type UserGoal = 'emagrecimento' | 'hipertrofia' | 'saude';

// Tipo para perfil do usuário
export interface UserProfile {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  goal: UserGoal;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}
