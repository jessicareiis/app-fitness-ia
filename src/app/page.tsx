"use client";

import { useState } from "react";
import { Camera, Dumbbell, Apple, TrendingUp, MessageCircle, Sparkles, Check, Zap, Crown, Menu, X, Upload, AlertCircle, Send, Play, ChefHat, Clock, Users, Flame, Settings, Moon, Sun, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

export default function FitAIProApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userProfile, setUserProfile] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "",
    goal: "",
    targetWeight: ""
  });

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Reconhecimento de Alimentos",
      description: "Tire uma foto do prato e a IA calcula calorias, proteínas, carboidratos e gorduras automaticamente"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Análise Corporal com IA",
      description: "Envie fotos do corpo e acompanhe sua evolução visual, medidas e percentual de gordura"
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Treinos Personalizados",
      description: "Vídeos de treino adaptados ao seu nível e objetivo: emagrecer, definir ou desinchar"
    },
    {
      icon: <Apple className="w-8 h-8" />,
      title: "Receitas Inteligentes",
      description: "IA cria receitas nutricionais exclusivas para seu objetivo, com modo passo a passo"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Coach Digital 24/7",
      description: "Chat com IA para tirar dúvidas sobre dieta, treino e evolução física em tempo real"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Plano Personalizado",
      description: "Dieta, calorias, horários de refeições e dicas motivacionais criados automaticamente"
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 29,90",
      period: "/mês",
      features: [
        "Calorias por foto",
        "Cálculo de IMC",
        "Receitas simples",
        "Suporte básico"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Plus",
      price: "R$ 49,90",
      period: "/mês",
      popular: true,
      features: [
        "Tudo do Básico",
        "Evolução corporal por IA",
        "Receitas completas",
        "Alguns treinos em vídeo",
        "Relatórios mensais"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Premium",
      price: "R$ 79,90",
      period: "/mês",
      features: [
        "Acesso total ilimitado",
        "Treinos completos",
        "Receitas criadas pela IA",
        "Relatórios semanais",
        "Coach digital completo",
        "Planos 100% personalizados"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  if (showDashboard) {
    return <Dashboard userProfile={userProfile} onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/50 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitAI Pro
              </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition">Recursos</a>
              <a href="#plans" className="text-gray-300 hover:text-white transition">Planos</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">Como Funciona</a>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => setShowSignup(true)}
              >
                Teste Grátis 1 Dia
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <a href="#features" className="text-gray-300 hover:text-white transition">Recursos</a>
              <a href="#plans" className="text-gray-300 hover:text-white transition">Planos</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">Como Funciona</a>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
                onClick={() => setShowSignup(true)}
              >
                Teste Grátis 1 Dia
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Teste grátis por 24 horas - Sem cartão de crédito</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Transforme Seu Corpo
            </span>
            <br />
            <span className="text-white">Com Inteligência Artificial</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Análise corporal por IA, reconhecimento de alimentos, treinos personalizados e um coach digital 24/7. 
            Tudo que você precisa para alcançar seus objetivos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-6 w-full sm:w-auto"
              onClick={() => setShowSignup(true)}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Teste Grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-6 w-full sm:w-auto"
            >
              Ver Como Funciona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-300">Precisão da IA</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-pink-400 mb-2">50k+</div>
              <div className="text-gray-300">Usuários Ativos</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-purple-400 mb-2">4.9★</div>
              <div className="text-gray-300">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Recursos Poderosos de IA
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tecnologia de ponta para acelerar seus resultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-black/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simples, rápido e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Cadastro Inteligente", desc: "Informe seus dados e objetivos" },
              { step: "2", title: "Análise Inicial", desc: "IA cria seu plano personalizado" },
              { step: "3", title: "Acompanhamento", desc: "Registre refeições e treinos" },
              { step: "4", title: "Evolução", desc: "Veja seus resultados em tempo real" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Escolha Seu Plano
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comece com 1 dia grátis e escolha o melhor plano para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`bg-white/5 backdrop-blur-sm border-white/10 p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Mais Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition`}
                  onClick={() => setShowSignup(true)}
                >
                  Começar Agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 p-12 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Pronto Para Transformar Seu Corpo?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Teste grátis por 24 horas. Sem compromisso, sem cartão de crédito.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => setShowSignup(true)}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Começar Teste Grátis Agora
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FitAI Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Seu coach digital de fitness e nutrição com inteligência artificial.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition">Planos</a></li>
                <li><a href="#" className="hover:text-white transition">Preços</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 FitAI Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Signup Dialog */}
      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Comece Sua Transformação
            </DialogTitle>
          </DialogHeader>
          <SignupForm 
            userProfile={userProfile} 
            setUserProfile={setUserProfile}
            onComplete={() => {
              setShowSignup(false);
              setShowDashboard(true);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignupForm({ userProfile, setUserProfile, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const calculateBMI = () => {
    if (userProfile.weight && userProfile.height) {
      const heightInMeters = parseFloat(userProfile.height) / 100;
      const bmi = parseFloat(userProfile.weight) / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const calculateTMB = () => {
    if (userProfile.weight && userProfile.height && userProfile.age && userProfile.gender) {
      const weight = parseFloat(userProfile.weight);
      const height = parseFloat(userProfile.height);
      const age = parseFloat(userProfile.age);
      
      let tmb;
      if (userProfile.gender === "male") {
        tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      return Math.round(tmb);
    }
    return null;
  };

  const getRecommendedCalories = () => {
    const tmb = calculateTMB();
    if (!tmb) return null;
    
    const activityFactor = 1.55;
    const maintenanceCalories = tmb * activityFactor;
    
    if (userProfile.goal === "lose") {
      return Math.round(maintenanceCalories - 500);
    } else if (userProfile.goal === "gain") {
      return Math.round(maintenanceCalories + 300);
    }
    return Math.round(maintenanceCalories);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults) {
    const bmi = calculateBMI();
    const tmb = calculateTMB();
    const calories = getRecommendedCalories();

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Seu Plano Personalizado
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">IMC</span>
              <span className="text-2xl font-bold text-purple-400">{bmi}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">TMB</span>
              <span className="text-2xl font-bold text-pink-400">{tmb} kcal</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Calorias/Dia</span>
              <span className="text-2xl font-bold text-purple-400">{calories} kcal</span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          size="lg"
          onClick={onComplete}
        >
          Acessar Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={`step${step}`} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5">
          <TabsTrigger value="step1" disabled={step !== 1}>Dados Básicos</TabsTrigger>
          <TabsTrigger value="step2" disabled={step !== 2}>Objetivos</TabsTrigger>
        </TabsList>

        <TabsContent value="step1" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-gray-300">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={userProfile.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height" className="text-gray-300">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={userProfile.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-300">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={userProfile.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-300">Sexo</Label>
              <Select value={userProfile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => setStep(2)}
            disabled={!userProfile.weight || !userProfile.height || !userProfile.age || !userProfile.gender}
          >
            Continuar
          </Button>
        </TabsContent>

        <TabsContent value="step2" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-gray-300">Objetivo Principal</Label>
            <Select value={userProfile.goal} onValueChange={(value) => handleInputChange("goal", value)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione seu objetivo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="lose">Perder Peso</SelectItem>
                <SelectItem value="gain">Ganhar Massa Muscular</SelectItem>
                <SelectItem value="maintain">Manter Peso</SelectItem>
                <SelectItem value="tone">Definir e Tonificar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetWeight" className="text-gray-300">Peso Desejado (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              placeholder="65"
              value={userProfile.targetWeight}
              onChange={(e) => handleInputChange("targetWeight", e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
              onClick={() => setStep(1)}
            >
              Voltar
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={handleSubmit}
              disabled={!userProfile.goal || !userProfile.targetWeight}
            >
              Ver Meu Plano
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Dashboard({ userProfile, onBack }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([ 
    { role: 'assistant', content: 'Olá! Sou seu coach digital. Como posso ajudar você hoje?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async () => {
    if (!selectedFile || !preview) return;
    
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: preview,
          userGoal: userProfile.goal 
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro ao analisar:', error);
      setResult({ error: 'Erro ao analisar imagem. Tente novamente.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeBody = async () => {
    if (!selectedFile || !preview) return;
    
    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: preview,
          userProfile 
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro ao analisar:', error);
      setResult({ error: 'Erro ao analisar imagem. Tente novamente.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          userProfile,
          history: chatMessages
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Erro no chat:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro. Tente novamente.' 
      }]);
    }
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Assinatura cancelada com sucesso! Você terá acesso até o final do período pago.');
        setShowCancelDialog(false);
      } else {
        alert('Erro ao cancelar assinatura. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Erro ao cancelar assinatura. Tente novamente.');
    } finally {
      setCanceling(false);
    }
  };

  const workouts = [
    {
      title: "Treino HIIT Iniciante",
      duration: "20 min",
      calories: "250 kcal",
      level: "Iniciante",
      exercises: ["Polichinelos", "Agachamento", "Flexão", "Prancha"]
    },
    {
      title: "Treino de Força",
      duration: "35 min",
      calories: "320 kcal",
      level: "Intermediário",
      exercises: ["Supino", "Agachamento", "Levantamento Terra", "Remada"]
    },
    {
      title: "Cardio Intenso",
      duration: "30 min",
      calories: "400 kcal",
      level: "Avançado",
      exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Sprint"]
    }
  ];

  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  const generateRecipe = async (mealType: string) => {
    setGeneratingRecipe(true);
    setRecipe(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mealType,
          userProfile
        })
      });

      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Erro ao gerar receita:', error);
      setRecipe({ error: 'Erro ao gerar receita. Tente novamente.' });
    } finally {
      setGeneratingRecipe(false);
    }
  };

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" 
    : "min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50";

  const cardClass = darkMode
    ? "bg-white/5 backdrop-blur-sm border-white/10"
    : "bg-white backdrop-blur-sm border-gray-200";

  const textClass = darkMode ? "text-white" : "text-gray-900";
  const textSecondaryClass = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className={bgClass}>
      <div className="p-4 sm:p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${textClass}`}>FitAI Pro</h1>
                <p className={`text-sm ${textSecondaryClass}`}>Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack} className={darkMode ? "border-white/10 text-white hover:bg-white/5" : "border-gray-300 text-gray-900 hover:bg-gray-100"}>
              Voltar
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="food" className="w-full">
            <TabsList className={`grid w-full grid-cols-6 ${darkMode ? 'bg-white/5' : 'bg-gray-100'} mb-6`}>
              <TabsTrigger value="food">Alimentos</TabsTrigger>
              <TabsTrigger value="body">Corpo</TabsTrigger>
              <TabsTrigger value="workouts">Treinos</TabsTrigger>
              <TabsTrigger value="recipes">Receitas</TabsTrigger>
              <TabsTrigger value="chat">Coach IA</TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            {/* ALIMENTOS TAB */}
            <TabsContent value="food" className="space-y-6">
              <Card className={`${cardClass} p-6`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
                  <Camera className="w-6 h-6 text-purple-400" />
                  Reconhecimento de Alimentos
                </h3>
                
                <div className="space-y-4">
                  <div className={`border-2 border-dashed ${darkMode ? 'border-white/20 hover:border-purple-500/50' : 'border-gray-300 hover:border-purple-500'} rounded-xl p-8 text-center transition`}>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="food-upload"
                    />
                    <label htmlFor="food-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className={`${textClass} mb-2 font-medium`}>Tire uma foto do seu prato</p>
                      <p className={`text-sm ${textSecondaryClass}`}>ou clique para selecionar da galeria</p>
                    </label>
                  </div>

                  {preview && (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className={`w-full h-64 object-cover rounded-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />
                      <Button 
                        onClick={analyzeFood}
                        disabled={analyzing}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="lg"
                      >
                        {analyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Analisando com IA...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analisar Alimentos
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {result && !result.error && result.alimentos && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 space-y-4">
                      <h4 className={`text-lg font-bold ${textClass} flex items-center gap-2`}>
                        <Check className="w-5 h-5 text-green-400" />
                        Análise Completa
                      </h4>
                      
                      <div className="space-y-3">
                        {result.alimentos.map((food: any, idx: number) => (
                          <div key={idx} className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-4 space-y-2`}>
                            <div className="flex items-center justify-between">
                              <p className={`${textClass} font-bold text-lg`}>{food.nome}</p>
                              <span className="text-purple-400 font-bold">{food.calorias} kcal</span>
                            </div>
                            <p className={`text-sm ${textSecondaryClass}`}>{food.descricao}</p>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded p-2 text-center`}>
                                <p className={`${textSecondaryClass} text-xs`}>Proteína</p>
                                <p className={`${textClass} font-bold`}>{food.proteinas}g</p>
                              </div>
                              <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded p-2 text-center`}>
                                <p className={`${textSecondaryClass} text-xs`}>Carboidratos</p>
                                <p className={`${textClass} font-bold`}>{food.carboidratos}g</p>
                              </div>
                              <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded p-2 text-center`}>
                                <p className={`${textSecondaryClass} text-xs`}>Gorduras</p>
                                <p className={`${textClass} font-bold`}>{food.gorduras}g</p>
                              </div>
                              <div className={`${darkMode ? 'bg-white/5' : 'bg-gray-100'} rounded p-2 text-center`}>
                                <p className={`${textSecondaryClass} text-xs`}>Porção</p>
                                <p className={`${textClass} font-bold`}>{food.porcao}</p>
                              </div>
                            </div>
                            {food.alternativa_saudavel && (
                              <div className="bg-green-500/10 border border-green-500/30 rounded p-3 mt-2">
                                <p className="text-green-400 text-sm font-medium">💡 Alternativa mais saudável:</p>
                                <p className={`${textSecondaryClass} text-sm`}>{food.alternativa_saudavel}</p>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-200'} pt-4 mt-4`}>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                              <p className={`${textSecondaryClass} text-sm mb-1`}>Total de Calorias</p>
                              <p className="text-3xl font-bold text-purple-400">{result.total_calorias}</p>
                              <p className={`text-xs ${textSecondaryClass}`}>kcal</p>
                            </div>
                            <div className="bg-pink-500/20 rounded-lg p-4 text-center">
                              <p className={`${textSecondaryClass} text-sm mb-1`}>Macros Totais</p>
                              <p className={`text-sm ${textClass}`}>
                                P: {result.total_proteinas}g | C: {result.total_carboidratos}g | G: {result.total_gorduras}g
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {result?.error && (
                    <Alert className="bg-red-500/10 border-red-500/30">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* CORPO TAB */}
            <TabsContent value="body" className="space-y-6">
              <Card className={`${cardClass} p-6`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                  Análise Corporal com IA
                </h3>
                
                <div className="space-y-4">
                  <Alert className="bg-blue-500/10 border-blue-500/30">
                    <AlertCircle className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-300">
                      Tire fotos do corpo (frente, costas ou lateral) para análise de evolução e composição corporal.
                    </AlertDescription>
                  </Alert>

                  <div className={`border-2 border-dashed ${darkMode ? 'border-white/20 hover:border-pink-500/50' : 'border-gray-300 hover:border-pink-500'} rounded-xl p-8 text-center transition`}>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="body-upload"
                    />
                    <label htmlFor="body-upload" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                      <p className={`${textClass} mb-2 font-medium`}>Tire uma foto do seu corpo</p>
                      <p className={`text-sm ${textSecondaryClass}`}>Frente, costas ou lateral</p>
                    </label>
                  </div>

                  {preview && (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className={`w-full h-64 object-cover rounded-xl border ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />
                      <Button 
                        onClick={analyzeBody}
                        disabled={analyzing}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        size="lg"
                      >
                        {analyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Analisando corpo...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analisar Corpo
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {result && !result.error && result.analise_corporal && (
                    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30 space-y-4">
                      <h4 className={`text-lg font-bold ${textClass} flex items-center gap-2`}>
                        <Check className="w-5 h-5 text-green-400" />
                        Análise Corporal Completa
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-4`}>
                          <p className={`${textSecondaryClass} text-sm mb-1`}>% Gordura Estimado</p>
                          <p className="text-3xl font-bold text-pink-400">{result.analise_corporal.percentual_gordura}%</p>
                        </div>
                        <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-4`}>
                          <p className={`${textSecondaryClass} text-sm mb-1`}>Massa Magra</p>
                          <p className="text-3xl font-bold text-purple-400">{result.analise_corporal.massa_magra}kg</p>
                        </div>
                        <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-4`}>
                          <p className={`${textSecondaryClass} text-sm mb-1`}>IMC Estimado</p>
                          <p className="text-3xl font-bold text-pink-400">{result.analise_corporal.imc_estimado}</p>
                        </div>
                        <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-4`}>
                          <p className={`${textSecondaryClass} text-sm mb-1`}>Classificação</p>
                          <p className="text-lg font-bold text-purple-400">{result.analise_corporal.classificacao}</p>
                        </div>
                      </div>

                      {result.analise_corporal.medidas && (
                        <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-4`}>
                          <p className={`${textClass} font-bold mb-3`}>Medidas Estimadas</p>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className={textSecondaryClass}>Ombros</p>
                              <p className={`${textClass} font-bold`}>{result.analise_corporal.medidas.ombros}cm</p>
                            </div>
                            <div>
                              <p className={textSecondaryClass}>Cintura</p>
                              <p className={`${textClass} font-bold`}>{result.analise_corporal.medidas.cintura}cm</p>
                            </div>
                            <div>
                              <p className={textSecondaryClass}>Quadril</p>
                              <p className={`${textClass} font-bold`}>{result.analise_corporal.medidas.quadril}cm</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.recomendacoes && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <p className="text-green-400 font-bold mb-2">🎯 Recomendações Personalizadas</p>
                          <p className={`${textSecondaryClass} text-sm mb-2`}>{result.recomendacoes.plano_alimentar}</p>
                          <p className={`${textSecondaryClass} text-sm`}>{result.recomendacoes.treino_recomendado}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {result?.error && (
                    <Alert className="bg-red-500/10 border-red-500/30">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* TREINOS TAB */}
            <TabsContent value="workouts" className="space-y-6">
              <Card className={`${cardClass} p-6`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
                  <Dumbbell className="w-6 h-6 text-orange-400" />
                  Treinos Personalizados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {workouts.map((workout, idx) => (
                    <Card key={idx} className={`${cardClass} p-5 hover:${darkMode ? 'bg-white/10' : 'bg-gray-50'} transition group`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          workout.level === 'Iniciante' ? 'bg-green-500/20 text-green-400' :
                          workout.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {workout.level}
                        </span>
                        <Play className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                      </div>
                      
                      <h4 className={`${textClass} font-bold text-lg mb-2`}>{workout.title}</h4>
                      
                      <div className={`flex items-center gap-4 text-sm ${textSecondaryClass} mb-3`}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {workout.calories}
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        {workout.exercises.map((exercise, i) => (
                          <p key={i} className={`text-sm ${textSecondaryClass} flex items-center gap-2`}>
                            <Check className="w-3 h-3 text-purple-400" />
                            {exercise}
                          </p>
                        ))}
                      </div>

                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Treino
                      </Button>
                    </Card>
                  ))}
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30 mt-6">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    Os treinos são adaptados automaticamente ao seu objetivo: {
                      userProfile.goal === 'lose' ? 'Perder Peso' :
                      userProfile.goal === 'gain' ? 'Ganhar Massa' :
                      userProfile.goal === 'tone' ? 'Definir e Tonificar' :
                      'Manter Peso'
                    }
                  </AlertDescription>
                </Alert>
              </Card>
            </TabsContent>

            {/* RECEITAS TAB */}
            <TabsContent value="recipes" className="space-y-6">
              <Card className={`${cardClass} p-6`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
                  <ChefHat className="w-6 h-6 text-green-400" />
                  Receitas Inteligentes
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {['Café da Manhã', 'Almoço', 'Lanche', 'Jantar'].map((meal) => (
                    <Button
                      key={meal}
                      onClick={() => generateRecipe(meal)}
                      disabled={generatingRecipe}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {generatingRecipe ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {meal}
                        </>
                      )}
                    </Button>
                  ))}
                </div>

                {recipe && !recipe.error && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xl font-bold ${textClass}`}>{recipe.nome}</h4>
                      <span className="text-green-400 font-bold text-lg">{recipe.calorias} kcal</span>
                    </div>

                    <p className={`${textSecondaryClass} text-sm`}>{recipe.descricao}</p>

                    <div className="grid grid-cols-3 gap-3">
                      <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-3 text-center`}>
                        <p className={`${textSecondaryClass} text-xs`}>Proteína</p>
                        <p className={`${textClass} font-bold`}>{recipe.proteinas}g</p>
                      </div>
                      <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-3 text-center`}>
                        <p className={`${textSecondaryClass} text-xs`}>Carboidratos</p>
                        <p className={`${textClass} font-bold`}>{recipe.carboidratos}g</p>
                      </div>
                      <div className={`${darkMode ? 'bg-white/5' : 'bg-white/50'} rounded-lg p-3 text-center`}>
                        <p className={`${textSecondaryClass} text-xs`}>Gorduras</p>
                        <p className={`${textClass} font-bold`}>{recipe.gorduras}g</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className={`${textClass} font-bold mb-2 flex items-center gap-2`}>
                          <Check className="w-4 h-4 text-green-400" />
                          Ingredientes
                        </p>
                        <ul className="space-y-1">
                          {recipe.ingredientes.map((ing: string, i: number) => (
                            <li key={i} className={`${textSecondaryClass} text-sm pl-6`}>• {ing}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className={`${textClass} font-bold mb-2 flex items-center gap-2`}>
                          <Clock className="w-4 h-4 text-green-400" />
                          Modo de Preparo ({recipe.tempo_preparo})
                        </p>
                        <ol className="space-y-2">
                          {recipe.modo_preparo.map((step: string, i: number) => (
                            <li key={i} className={`${textSecondaryClass} text-sm pl-6`}>
                              <span className="font-bold text-green-400">{i + 1}.</span> {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {recipe.dica && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-400 text-sm font-medium">💡 Dica do Chef:</p>
                        <p className={`${textSecondaryClass} text-sm`}>{recipe.dica}</p>
                      </div>
                    )}
                  </div>
                )}

                {recipe?.error && (
                  <Alert className="bg-red-500/10 border-red-500/30">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {recipe.error}
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    Receitas criadas pela IA especialmente para seu objetivo e necessidades calóricas.
                  </AlertDescription>
                </Alert>
              </Card>
            </TabsContent>

            {/* COACH IA TAB */}
            <TabsContent value="chat" className="space-y-6">
              <Card className={`${cardClass} p-6`}>
                <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                  Coach Digital 24/7
                </h3>
                
                <ScrollArea className="h-[400px] pr-4 mb-4">
                  <div className="space-y-4">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : darkMode 
                                ? 'bg-white/5 text-gray-200 border border-white/10'
                                : 'bg-gray-100 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    placeholder="Pergunte sobre dieta, treino, evolução..."
                    className={`${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} resize-none`}
                    rows={3}
                  />
                  <Button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim()}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30 mt-4">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    Seu coach conhece seu perfil e objetivos. Pergunte qualquer coisa sobre fitness e nutrição!
                  </AlertDescription>
                </Alert>
              </Card>
            </TabsContent>

            {/* CONFIGURAÇÕES TAB */}
            <TabsContent value="settings" className="space-y-6">
              <Card className={`${cardClass} p-6`}>
                <h3 className={`text-xl font-bold ${textClass} mb-6 flex items-center gap-2`}>
                  <Settings className="w-6 h-6 text-purple-400" />
                  Configurações
                </h3>

                {/* Tema */}
                <div className="space-y-6">
                  <div className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                      <div>
                        <p className={`font-medium ${textClass}`}>Tema do Aplicativo</p>
                        <p className={`text-sm ${textSecondaryClass}`}>
                          {darkMode ? 'Modo Escuro ativado' : 'Modo Claro ativado'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </div>

                  {/* Assinatura */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-start gap-3 mb-4">
                      <CreditCard className="w-5 h-5 text-purple-400 mt-1" />
                      <div className="flex-1">
                        <p className={`font-medium ${textClass} mb-1`}>Gerenciar Assinatura</p>
                        <p className={`text-sm ${textSecondaryClass} mb-3`}>
                          Plano atual: <span className="font-bold text-purple-400">Premium</span>
                        </p>
                        <p className={`text-xs ${textSecondaryClass} mb-4`}>
                          Próxima cobrança: 15/02/2024 - R$ 79,90
                        </p>
                        <Button
                          variant="destructive"
                          onClick={() => setShowCancelDialog(true)}
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar Assinatura
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Perfil */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-400 mt-1" />
                      <div className="flex-1">
                        <p className={`font-medium ${textClass} mb-3`}>Informações do Perfil</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className={textSecondaryClass}>Peso</p>
                            <p className={`${textClass} font-bold`}>{userProfile.weight} kg</p>
                          </div>
                          <div>
                            <p className={textSecondaryClass}>Altura</p>
                            <p className={`${textClass} font-bold`}>{userProfile.height} cm</p>
                          </div>
                          <div>
                            <p className={textSecondaryClass}>Idade</p>
                            <p className={`${textClass} font-bold`}>{userProfile.age} anos</p>
                          </div>
                          <div>
                            <p className={textSecondaryClass}>Objetivo</p>
                            <p className={`${textClass} font-bold`}>
                              {userProfile.goal === 'lose' ? 'Perder Peso' :
                               userProfile.goal === 'gain' ? 'Ganhar Massa' :
                               userProfile.goal === 'tone' ? 'Definir' : 'Manter'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sair */}
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className={`w-full ${darkMode ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair do Dashboard
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialog de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className={`${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'} max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-500 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Cancelar Assinatura
            </DialogTitle>
            <DialogDescription className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Tem certeza que deseja cancelar sua assinatura? Você perderá acesso a todos os recursos premium.
            </DialogDescription>
          </DialogHeader>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'} mb-2`}>
              ⚠️ O que você vai perder:
            </p>
            <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1 ml-4`}>
              <li>• Análise de alimentos com IA</li>
              <li>• Análise corporal avançada</li>
              <li>• Treinos personalizados completos</li>
              <li>• Receitas criadas pela IA</li>
              <li>• Coach digital 24/7</li>
            </ul>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className={darkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
            >
              Manter Assinatura
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-red-500 hover:bg-red-600"
            >
              {canceling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Cancelando...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Confirmar Cancelamento
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
