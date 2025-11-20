import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

/**
 * API Route: Criar sessão de checkout do Stripe
 * POST /api/stripe/checkout
 */
export async function POST(req: NextRequest) {
  try {
    const { planId, interval } = await req.json();

    if (!planId || !interval) {
      return NextResponse.json(
        { error: 'planId e interval são obrigatórios' },
        { status: 400 }
      );
    }

    // Mapeia planId + interval para Stripe Price ID
    const priceIdMap: Record<string, string> = {
      'basic-month': process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
      'plus-month': process.env.STRIPE_PRICE_PLUS_MONTHLY || '',
      'premium-month': process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
      'basic-year': process.env.STRIPE_PRICE_BASIC_YEARLY || '',
      'plus-year': process.env.STRIPE_PRICE_PLUS_YEARLY || '',
      'premium-year': process.env.STRIPE_PRICE_PREMIUM_YEARLY || ''
    };

    const priceId = priceIdMap[`${planId}-${interval}`];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      subscription_data: {
        trial_period_days: 1 // 1 dia de teste grátis
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        planId,
        interval
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Erro ao criar checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    );
  }
}
