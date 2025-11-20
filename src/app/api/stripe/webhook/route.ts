import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * API Route: Webhook do Stripe
 * POST /api/stripe/webhook
 * 
 * Processa eventos do Stripe:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura ausente' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Erro ao verificar webhook:', error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Processa evento
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout completado:', session.id);
        
        // TODO: Criar/atualizar assinatura no banco de dados
        // - Salvar customer_id
        // - Salvar subscription_id
        // - Ativar plano do usuário
        // - Enviar email de boas-vindas
        
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Assinatura criada:', subscription.id);
        
        // TODO: Atualizar status da assinatura no banco
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Assinatura atualizada:', subscription.id);
        
        // TODO: Atualizar status da assinatura no banco
        // - Verificar se mudou de plano
        // - Verificar se cancelou
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Assinatura cancelada:', subscription.id);
        
        // TODO: Desativar acesso do usuário
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Pagamento bem-sucedido:', invoice.id);
        
        // TODO: Registrar pagamento no banco
        // - Enviar recibo por email
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Pagamento falhou:', invoice.id);
        
        // TODO: Notificar usuário sobre falha
        // - Enviar email de cobrança pendente
        
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
