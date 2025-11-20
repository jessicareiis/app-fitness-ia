"use client";

import { useState } from "react";
import { Camera, Upload, TrendingUp, Apple, Dumbbell, MessageCircle, Home, User, Settings, LogOut, Sparkles, ChevronRight, Flame, Droplets, Zap, Loader2, CheckCircle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { analyzeFoodImage, fileToBase64 } from "@/lib/vision/food-analysis";
import { analyzeBodyImage } from "@/lib/vision/body-analysis";
import { generatePersonalizedRecommendations } from "@/lib/vision/recommendations";
import type { FoodAnalysisResult, BodyAnalysisResult, PersonalizedRecommendations, UserProfile } from "@/lib/types/vision";

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("home");
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Olá! Sou seu coach digital. Como posso ajudar você hoje?" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  
  // Estados para análises de IA
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysisResult | null>(null);
  const [bodyAnalysis, setBodyAnalysis] = useState<BodyAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendations | null>(null);
  const [isAnalyzingFood, setIsAnalyzingFood] = useState(false);
  const [isAnalyzingBody, setIsAnalyzingBody] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  // Perfil do usuário (em produção, viria do banco de dados)
  const userProfile: UserProfile = {
    weight: 75,
    height: 175,
    age: 28,
    gender: 'male',
    goal: 'emagrecimento',
    activityLevel: 'moderate'
  };

  // Dados simulados do usuário
  const userData = {
    name: "João Silva",
    currentWeight: 75,
    targetWeight: 70,
    height: 175,
    age: 28,
    dailyCalories: 1800,
    caloriesConsumed: foodAnalysis?.totals.calories || 1200,
    waterGoal: 2500,
    waterConsumed: 1800,
    workoutsThisWeek: 3,
    workoutGoal: 5
  };

  const handleFoodImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzingFood(true);
      
      // Converte para base64
      const base64Image = await fileToBase64(file);
      setFoodImage(base64Image);

      // Analisa com IA
      const analysis = await analyzeFoodImage(base64Image, userProfile);
      setFoodAnalysis(analysis);

      // Gera recomendações se análise foi bem-sucedida
      if (analysis.success && analysis.alimentos.length > 0) {
        setIsGeneratingRecommendations(true);
        const recs = await generatePersonalizedRecommendations(
          userProfile,
          analysis.alimentos,
          bodyAnalysis?.analise_corporal
        );
        setRecommendations(recs);
        setIsGeneratingRecommendations(false);
      }

    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setFoodAnalysis({
        success: false,
        error: 'Erro ao processar imagem. Tente novamente.',
        alimentos: [],
        totals: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 },
        suggestions: [],
        contextNotes: []
      });
    } finally {
      setIsAnalyzingFood(false);
    }
  };

  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzingBody(true);
      
      // Converte para base64
      const base64Image = await fileToBase64(file);
      setBodyImage(base64Image);

      // Analisa com IA
      const analysis = await analyzeBodyImage(
        base64Image, 
        userProfile,
        bodyAnalysis?.analise_corporal // Passa análise anterior para comparação
      );
      setBodyAnalysis(analysis);

      // Gera recomendações se análise foi bem-sucedida
      if (analysis.success) {
        setIsGeneratingRecommendations(true);
        const recs = await generatePersonalizedRecommendations(
          userProfile,
          foodAnalysis?.alimentos,
          analysis.analise_corporal
        );
        setRecommendations(recs);
        setIsGeneratingRecommendations(false);
      }

    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      setBodyAnalysis({
        success: false,
        error: 'Erro ao processar imagem. Tente novamente.',
        analise_corporal: {
          bodyFatPercentage: 0,
          leanMass: 0,
          estimatedBMI: 0,
          measurements: { shoulders: 0, chest: 0, waist: 0, hips: 0, thighs: 0, arms: 0 },
          posture: { status: 'needs_improvement', issues: [], corrections: [] },
          anatomicalPoints: { detected: [], confidence: 0 }
        }
      });
    } finally {
      setIsAnalyzingBody(false);
    }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    setChatMessages([...chatMessages, 
      { role: "user", content: userMessage },
      { role: "assistant", content: "Entendo sua dúvida! Com base no seu perfil e objetivo de perder 5kg, recomendo manter o déficit calórico de 500 kcal/dia. Isso significa consumir cerca de 1800 calorias diárias. Foque em proteínas magras, vegetais e carboidratos complexos. Quer que eu crie um plano de refeições para hoje?" }
    ]);
    setUserMessage("");
  };

  const recentMeals = foodAnalysis?.success && foodAnalysis.alimentos.length > 0 
    ? foodAnalysis.alimentos.map(food => ({
        name: food.name,
        calories: food.calories,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        items: food.description
      }))
    : [
        { name: "Café da Manhã", calories: 350, time: "08:00", items: "Ovos, pão integral, café" },
        { name: "Almoço", calories: 520, time: "12:30", items: "Arroz, frango, salada" },
        { name: "Lanche", calories: 180, time: "16:00", items: "Iogurte, frutas" }
      ];

  const workouts = recommendations?.workout ? [
    {
      name: recommendations.workout.type,
      duration: recommendations.workout.duration,
      level: "Personalizado",
      calories: 350
    }
  ] : [
    { name: "Treino de Peito e Tríceps", duration: "45 min", level: "Intermediário", calories: 320 },
    { name: "Treino de Costas e Bíceps", duration: "50 min", level: "Intermediário", calories: 350 },
    { name: "Treino de Pernas", duration: "60 min", level: "Avançado", calories: 420 }
  ];

  const recipes = [
    { name: "Frango Grelhado com Legumes", calories: 380, protein: 42, time: "25 min" },
    { name: "Omelete de Claras com Espinafre", calories: 220, protein: 28, time: "15 min" },
    { name: "Salmão com Batata Doce", calories: 450, protein: 38, time: "30 min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FitAI Pro</h1>
                <p className="text-xs text-gray-400">Plano Premium Ativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 border-2 border-purple-500">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-5 bg-white/5 backdrop-blur-sm border border-white/10 p-1">
            <TabsTrigger value="home" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Início</span>
            </TabsTrigger>
            <TabsTrigger value="food" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Apple className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Nutrição</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <Dumbbell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Treinos</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Evolução</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Coach IA</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Olá, {userData.name}! 👋</h2>
              <p className="text-white/90">Você está a {userData.currentWeight - userData.targetWeight}kg do seu objetivo!</p>
            </Card>

            {/* Daily Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-300 font-medium">Calorias</span>
                  </div>
                  <span className="text-sm text-gray-400">{userData.caloriesConsumed}/{userData.dailyCalories}</span>
                </div>
                <Progress value={(userData.caloriesConsumed / userData.dailyCalories) * 100} className="h-2 mb-2" />
                <p className="text-xs text-gray-400">Restam {userData.dailyCalories - userData.caloriesConsumed} kcal</p>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 font-medium">Hidratação</span>
                  </div>
                  <span className="text-sm text-gray-400">{userData.waterConsumed}/{userData.waterGoal}ml</span>
                </div>
                <Progress value={(userData.waterConsumed / userData.waterGoal) * 100} className="h-2 mb-2" />
                <p className="text-xs text-gray-400">Beba mais {userData.waterGoal - userData.waterConsumed}ml</p>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300 font-medium">Treinos</span>
                  </div>
                  <span className="text-sm text-gray-400">{userData.workoutsThisWeek}/{userData.workoutGoal}</span>
                </div>
                <Progress value={(userData.workoutsThisWeek / userData.workoutGoal) * 100} className="h-2 mb-2" />
                <p className="text-xs text-gray-400">Faltam {userData.workoutGoal - userData.workoutsThisWeek} treinos</p>
              </Card>
            </div>

            {/* Recent Meals */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Refeições de Hoje</h3>
              <div className="space-y-3">
                {recentMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{meal.name}</p>
                      <p className="text-sm text-gray-400">{meal.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-400">{meal.calories} kcal</p>
                      <p className="text-xs text-gray-400">{meal.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            {recommendations && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Recomendações Personalizadas
                </h3>
                <div className="space-y-4">
                  {recommendations.motivationalTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                      <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-200 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Food Tab */}
          <TabsContent value="food" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-400" />
                Reconhecimento de Alimentos por IA
              </h3>
              <p className="text-gray-300 mb-4">Tire uma foto do seu prato e a IA calculará automaticamente as calorias e macros</p>
              
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFoodImageUpload}
                  className="hidden"
                  id="food-upload"
                  disabled={isAnalyzingFood}
                />
                <label htmlFor="food-upload" className="cursor-pointer">
                  {isAnalyzingFood ? (
                    <>
                      <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-spin" />
                      <p className="text-white font-medium mb-1">Analisando imagem...</p>
                      <p className="text-sm text-gray-400">A IA está identificando os alimentos</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <p className="text-white font-medium mb-1">Clique para tirar foto ou fazer upload</p>
                      <p className="text-sm text-gray-400">A IA analisará automaticamente</p>
                    </>
                  )}
                </label>
              </div>

              {foodImage && (
                <div className="mt-4">
                  <img src={foodImage} alt="Food" className="w-full h-48 object-cover rounded-xl" />
                </div>
              )}

              {/* Food Analysis Results */}
              {foodAnalysis && (
                <div className="mt-6 space-y-4">
                  {foodAnalysis.success ? (
                    <>
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Análise concluída com sucesso!</span>
                      </div>

                      {/* Totals */}
                      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-4">
                        <h4 className="font-bold text-white mb-3">Totais do Prato</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Calorias</p>
                            <p className="text-2xl font-bold text-purple-400">{foodAnalysis.totals.calories}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Proteínas</p>
                            <p className="text-2xl font-bold text-blue-400">{foodAnalysis.totals.protein}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Carboidratos</p>
                            <p className="text-2xl font-bold text-yellow-400">{foodAnalysis.totals.carbs}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Gorduras</p>
                            <p className="text-2xl font-bold text-orange-400">{foodAnalysis.totals.fats}g</p>
                          </div>
                        </div>
                      </Card>

                      {/* Individual Foods */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-white">Alimentos Detectados</h4>
                        {foodAnalysis.alimentos.map((food, index) => (
                          <Card key={index} className="bg-white/5 border-white/10 p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-bold text-white">{food.name}</h5>
                                <p className="text-sm text-gray-400">{food.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Porção: {food.portion}</p>
                              </div>
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                {Math.round(food.confidence * 100)}% confiança
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                              <div>
                                <p className="text-xs text-gray-400">Calorias</p>
                                <p className="font-bold text-white">{food.calories}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Proteína</p>
                                <p className="font-bold text-white">{food.macros.protein}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Carbs</p>
                                <p className="font-bold text-white">{food.macros.carbs}g</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Gordura</p>
                                <p className="font-bold text-white">{food.macros.fats}g</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* Suggestions */}
                      {foodAnalysis.suggestions.length > 0 && (
                        <Card className="bg-blue-500/10 border-blue-500/30 p-4">
                          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            Sugestões da IA
                          </h4>
                          <ul className="space-y-2">
                            {foodAnalysis.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                      <XCircle className="w-5 h-5" />
                      <span>{foodAnalysis.error}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Meal Plan */}
            {recommendations?.mealPlan && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Plano Alimentar Personalizado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-purple-400 mb-2">Café da Manhã</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {recommendations.mealPlan.breakfast.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-400 mb-2">Almoço</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {recommendations.mealPlan.lunch.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-400 mb-2">Jantar</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {recommendations.mealPlan.dinner.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-400 mb-2">Lanches</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {recommendations.mealPlan.snacks.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Shopping List */}
            {recommendations?.shoppingList && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Lista de Compras</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {recommendations.shoppingList.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Workout Tab */}
          <TabsContent value="workout" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Treinos Personalizados</h3>
              <div className="space-y-4">
                {workouts.map((workout, index) => (
                  <Card key={index} className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">{workout.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span>⏱️ {workout.duration}</span>
                          <span>📊 {workout.level}</span>
                          <span>🔥 {workout.calories} kcal</span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Iniciar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Workout Details */}
            {recommendations?.workout && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Detalhes do Treino Personalizado</h3>
                <div className="space-y-3">
                  {recommendations.workout.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{exercise.name}</p>
                        <p className="text-sm text-gray-400">
                          {exercise.sets} séries × {exercise.reps} repetições
                        </p>
                      </div>
                      <span className="text-xs text-purple-400">
                        Descanso: {exercise.rest}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-400" />
                Análise Corporal com IA
              </h3>
              <p className="text-gray-300 mb-4">Envie fotos do seu corpo e a IA comparará com fotos anteriores</p>
              
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleBodyImageUpload}
                  className="hidden"
                  id="body-upload"
                  disabled={isAnalyzingBody}
                />
                <label htmlFor="body-upload" className="cursor-pointer">
                  {isAnalyzingBody ? (
                    <>
                      <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-spin" />
                      <p className="text-white font-medium mb-1">Analisando corpo...</p>
                      <p className="text-sm text-gray-400">A IA está detectando pontos anatômicos</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                      <p className="text-white font-medium mb-1">Enviar foto para análise</p>
                      <p className="text-sm text-gray-400">A IA detectará sua evolução</p>
                    </>
                  )}
                </label>
              </div>

              {bodyImage && (
                <div className="mt-4">
                  <img src={bodyImage} alt="Body" className="w-full h-64 object-cover rounded-xl" />
                </div>
              )}

              {/* Body Analysis Results */}
              {bodyAnalysis && (
                <div className="mt-6 space-y-4">
                  {bodyAnalysis.success ? (
                    <>
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Análise corporal concluída!</span>
                      </div>

                      {/* Body Composition */}
                      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 p-4">
                        <h4 className="font-bold text-white mb-3">Composição Corporal</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Gordura Corporal</p>
                            <p className="text-2xl font-bold text-purple-400">
                              {bodyAnalysis.analise_corporal.bodyFatPercentage}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Massa Magra</p>
                            <p className="text-2xl font-bold text-blue-400">
                              {bodyAnalysis.analise_corporal.leanMass}kg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">IMC Estimado</p>
                            <p className="text-2xl font-bold text-yellow-400">
                              {bodyAnalysis.analise_corporal.estimatedBMI.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Measurements */}
                      <Card className="bg-white/5 border-white/10 p-4">
                        <h4 className="font-bold text-white mb-3">Medidas Corporais (cm)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-400">Ombros</span>
                            <span className="text-white font-bold">
                              {bodyAnalysis.analise_corporal.measurements.shoulders}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-400">Peito</span>
                            <span className="text-white font-bold">
                              {bodyAnalysis.analise_corporal.measurements.chest}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-400">Cintura</span>
                            <span className="text-white font-bold">
                              {bodyAnalysis.analise_corporal.measurements.waist}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-400">Quadril</span>
                            <span className="text-white font-bold">
                              {bodyAnalysis.analise_corporal.measurements.hips}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-400">Coxas</span>
                            <span className="text-white font-bold">
                              {bodyAnalysis.analise_corporal.measurements.thighs}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-gray-400">Braços</span>
                            <span className="text-white font-bold">
                              {bodyAnalysis.analise_corporal.measurements.arms}
                            </span>
                          </div>
                        </div>
                      </Card>

                      {/* Posture Analysis */}
                      <Card className="bg-white/5 border-white/10 p-4">
                        <h4 className="font-bold text-white mb-3">Análise de Postura</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              bodyAnalysis.analise_corporal.posture.status === 'good' 
                                ? 'bg-green-500/20 text-green-400'
                                : bodyAnalysis.analise_corporal.posture.status === 'needs_improvement'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {bodyAnalysis.analise_corporal.posture.status === 'good' 
                                ? 'Boa Postura'
                                : bodyAnalysis.analise_corporal.posture.status === 'needs_improvement'
                                ? 'Precisa Melhorar'
                                : 'Postura Ruim'}
                            </span>
                          </div>
                          
                          {bodyAnalysis.analise_corporal.posture.issues.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Problemas Detectados:</p>
                              <ul className="space-y-1">
                                {bodyAnalysis.analise_corporal.posture.issues.map((issue, i) => (
                                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-red-400">•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {bodyAnalysis.analise_corporal.posture.corrections.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Correções Sugeridas:</p>
                              <ul className="space-y-1">
                                {bodyAnalysis.analise_corporal.posture.corrections.map((correction, i) => (
                                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-green-400">✓</span>
                                    {correction}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* Evolution */}
                      {bodyAnalysis.evolution && (
                        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 p-4">
                          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Evolução Detectada
                          </h4>
                          <div className="space-y-2">
                            {bodyAnalysis.evolution.progressNotes.map((note, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                {note}
                              </div>
                            ))}
                          </div>
                        </Card>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                      <XCircle className="w-5 h-5" />
                      <span>{bodyAnalysis.error}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Weight Progress */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Evolução de Peso</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Peso Atual</span>
                  <span className="text-2xl font-bold text-purple-400">{userData.currentWeight} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Meta</span>
                  <span className="text-2xl font-bold text-pink-400">{userData.targetWeight} kg</span>
                </div>
                <Progress value={((userData.currentWeight - userData.targetWeight) / userData.currentWeight) * 100} className="h-3" />
                <p className="text-sm text-gray-400 text-center">Faltam {userData.currentWeight - userData.targetWeight}kg para sua meta</p>
              </div>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                Coach Digital IA
              </h3>
              
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-white/10 text-gray-200'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Pergunte sobre dieta, treino, calorias..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="bg-white/5 border-white/10 text-white resize-none"
                  rows={2}
                />
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={handleSendMessage}
                >
                  Enviar
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
