"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Crown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PLANS, formatPrice, calculateYearlyDiscount, type Plan } from "@/lib/stripe";

interface PricingCardsProps {
  currentPlan?: string;
  onSelectPlan?: (planId: string) => void;
}

export function PricingCards({ currentPlan, onSelectPlan }: PricingCardsProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowCheckoutDialog(true);
    onSelectPlan?.(plan.id);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="w-6 h-6" />;
      case 'plus':
        return <Sparkles className="w-6 h-6" />;
      case 'premium':
        return <Crown className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'from-blue-500 to-cyan-500';
      case 'plus':
        return 'from-purple-500 to-pink-500';
      case 'premium':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              billingInterval === 'month'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-6 py-2 rounded-full font-medium transition relative ${
              billingInterval === 'year'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Anual
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
              -17%
            </Badge>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const yearlyData = calculateYearlyDiscount(plan.price);
            const displayPrice = billingInterval === 'year' 
              ? yearlyData.yearlyPrice / 12 
              : plan.price;

            return (
              <Card
                key={plan.id}
                className={`relative bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Mais Popular
                  </Badge>
                )}

                {isCurrentPlan && (
                  <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
                    Plano Atual
                  </Badge>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${getPlanColor(plan.id)} mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                  {billingInterval === 'year' && (
                    <p className="text-sm text-green-400 mt-1">
                      Economize {formatPrice(yearlyData.savings)}/ano
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                  {!isCurrentPlan && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Trial Notice */}
        <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Teste Grátis de 1 Dia</h4>
              <p className="text-sm text-gray-300">
                Experimente todas as funcionalidades do plano escolhido por 24 horas, 
                sem compromisso. Cancele a qualquer momento antes do fim do período de teste.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              Confirmar Assinatura - {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Você será redirecionado para o checkout seguro do Stripe
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              {/* Plan Summary */}
              <Card className="bg-white/5 border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Plano</span>
                  <span className="text-white font-bold">{selectedPlan.name}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Período</span>
                  <span className="text-white font-bold">
                    {billingInterval === 'month' ? 'Mensal' : 'Anual'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Valor</span>
                  <span className="text-white font-bold">
                    {formatPrice(
                      billingInterval === 'year'
                        ? calculateYearlyDiscount(selectedPlan.price).yearlyPrice
                        : selectedPlan.price
                    )}
                    {billingInterval === 'year' && '/ano'}
                    {billingInterval === 'month' && '/mês'}
                  </span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Teste Grátis</span>
                    <Badge className="bg-green-500 text-white">1 dia</Badge>
                  </div>
                </div>
              </Card>

              {/* Important Info */}
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-xs text-blue-300">
                  • Você não será cobrado durante o período de teste<br />
                  • Cancele a qualquer momento antes do fim do teste<br />
                  • Após o teste, a cobrança será automática<br />
                  • Pagamento 100% seguro via Stripe
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCheckoutDialog(false)}
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Integrar com Stripe Checkout
                    console.log('Redirect to Stripe Checkout', {
                      plan: selectedPlan.id,
                      interval: billingInterval
                    });
                    alert('Integração com Stripe será implementada aqui');
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  Continuar para Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
