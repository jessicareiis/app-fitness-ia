"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/custom/pricing-cards";
import Link from "next/link";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    
    // TODO: Integrar com API do Stripe
    // const response = await fetch('/api/stripe/checkout', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ planId, interval: 'month' })
    // });
    // const { url } = await response.json();
    // window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FitAI Pro</h1>
                <p className="text-xs text-gray-400">Escolha seu plano</p>
              </div>
            </div>

            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Ir para Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transforme seu corpo com inteligência artificial. 
            Comece com 1 dia de teste grátis.
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingCards 
          currentPlan={undefined}
          onSelectPlan={handleSelectPlan}
        />

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <summary className="font-bold text-white cursor-pointer">
                Como funciona o teste grátis?
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                Você tem acesso total ao plano escolhido por 24 horas. 
                Não cobramos nada durante o período de teste. 
                Cancele a qualquer momento antes do fim do teste.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <summary className="font-bold text-white cursor-pointer">
                Posso cancelar a qualquer momento?
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                Sim! Você pode cancelar sua assinatura a qualquer momento. 
                Seu acesso continuará até o fim do período pago.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <summary className="font-bold text-white cursor-pointer">
                Posso mudar de plano depois?
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                O valor será ajustado proporcionalmente.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <summary className="font-bold text-white cursor-pointer">
                Quais formas de pagamento são aceitas?
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                Aceitamos todos os principais cartões de crédito e débito via Stripe. 
                Pagamento 100% seguro e criptografado.
              </p>
            </details>

            <details className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <summary className="font-bold text-white cursor-pointer">
                A IA realmente funciona?
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                Sim! Usamos a tecnologia GPT-4 Vision da OpenAI para análise de imagens. 
                A precisão é alta, mas recomendamos sempre consultar um profissional de saúde.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
