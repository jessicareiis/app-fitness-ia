import OpenAI from 'openai';

// Cliente OpenAI configurado
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Para uso client-side (em produção, use API routes)
});

export default openai;
