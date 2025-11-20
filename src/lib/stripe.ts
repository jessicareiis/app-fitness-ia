/**
 * Configuração do Stripe para pagamentos
 * Sistema de planos: Básico, Plus e Premium
 */

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  priceId?: string; // Stripe Price ID
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    interval: 'month',
    features: [
      'Reconhecimento de alimentos por foto',
      'Cálculo de calorias e macros',
      'IMC e TMB automático',
      'Receitas simples',
      'Suporte por email'
    ]
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 49.90,
    interval: 'month',
    popular: true,
    features: [
      'Tudo do Básico +',
      'Análise corporal com IA',
      'Evolução semanal',
      'Receitas completas',
      'Treinos personalizados',
      'Chat com Coach IA (limitado)',
      'Relatórios mensais'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79.90,
    interval: 'month',
    features: [
      'Tudo do Plus +',
      'Acesso total ilimitado',
      'Treinos completos em vídeo',
      'Receitas criadas por IA',
      'Relatórios semanais detalhados',
      'Chat ilimitado com Coach IA',
      'Planos 100% personalizados',
      'Suporte prioritário 24/7',
      'Análise de postura',
      'Comparação de evolução'
    ]
  }
];

export const TRIAL_PERIOD_DAYS = 1;

/**
 * Configuração do Stripe (client-side)
 */
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  apiVersion: '2023-10-16' as const
};

/**
 * Verifica se usuário tem acesso a uma feature
 */
export function hasFeatureAccess(
  userPlan: string,
  feature: 'food_recognition' | 'body_analysis' | 'ai_chat' | 'workouts' | 'recipes' | 'reports'
): boolean {
  const featureMap: Record<string, string[]> = {
    basic: ['food_recognition'],
    plus: ['food_recognition', 'body_analysis', 'workouts', 'recipes'],
    premium: ['food_recognition', 'body_analysis', 'ai_chat', 'workouts', 'recipes', 'reports']
  };

  return featureMap[userPlan]?.includes(feature) || false;
}

/**
 * Formata preço em BRL
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

/**
 * Calcula desconto anual
 */
export function calculateYearlyDiscount(monthlyPrice: number): {
  yearlyPrice: number;
  discount: number;
  savings: number;
} {
  const yearlyPrice = monthlyPrice * 10; // 2 meses grátis
  const fullYearPrice = monthlyPrice * 12;
  const savings = fullYearPrice - yearlyPrice;
  const discount = Math.round((savings / fullYearPrice) * 100);

  return {
    yearlyPrice,
    discount,
    savings
  };
}

/**
 * Tipos de eventos do Stripe
 */
export type StripeEvent = 
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

/**
 * Status de assinatura
 */
export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

/**
 * Interface de assinatura do usuário
 */
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

/**
 * Verifica se assinatura está ativa
 */
export function isSubscriptionActive(subscription: UserSubscription): boolean {
  return subscription.status === 'active' || subscription.status === 'trialing';
}

/**
 * Verifica se está em período de teste
 */
export function isInTrialPeriod(subscription: UserSubscription): boolean {
  if (!subscription.trialEnd) return false;
  return new Date() < subscription.trialEnd && subscription.status === 'trialing';
}

/**
 * Calcula dias restantes do período
 */
export function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
