# 🏋️ FitAI Pro - Aplicativo de Fitness e Nutrição com IA

![FitAI Pro](https://img.shields.io/badge/Status-Ativo-success)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## 🌟 Sobre o Projeto

**FitAI Pro** é uma plataforma completa de fitness, nutrição e evolução corporal com inteligência artificial. O aplicativo oferece uma experiência personalizada para ajudar usuários a alcançarem seus objetivos de saúde e bem-estar.

### ✨ Diferenciais

- 🤖 **Inteligência Artificial Avançada** - Reconhecimento de alimentos e análise corporal
- 📱 **Design Responsivo** - Funciona perfeitamente em mobile, tablet e desktop
- 🎨 **Interface Moderna** - Visual elegante com gradientes e animações suaves
- 💪 **Personalização Total** - Planos adaptados ao perfil de cada usuário
- 🔒 **Teste Grátis** - 24 horas de acesso completo sem cartão de crédito

---

## 🚀 Funcionalidades Principais

### 1. 🎁 Teste Grátis de 1 Dia
- Acesso total por 24 horas
- Sem necessidade de cartão de crédito
- Experiência completa de todas as funcionalidades

### 2. 📸 IA de Reconhecimento de Alimentos
- Tire foto do prato
- IA identifica alimentos automaticamente
- Calcula calorias, proteínas, carboidratos e gorduras
- Registro automático no diário alimentar

### 3. 📊 IA de Análise Corporal
- Upload de fotos do corpo
- Comparação com fotos anteriores
- Detecção de evolução visual
- Estimativa de medidas e percentual de gordura
- Relatórios semanais automáticos

### 4. 🎯 Cadastro Inteligente
- Coleta de dados: peso, altura, idade, sexo
- Definição de objetivos e metas
- Cálculo automático de:
  - **IMC** (Índice de Massa Corporal)
  - **TMB** (Taxa Metabólica Basal)
  - **Calorias recomendadas** por dia
- Geração de plano inicial personalizado

### 5. 🥗 Plano de Emagrecimento Personalizado
A IA cria automaticamente:
- Dieta sugerida
- Número de calorias diárias
- Horários ideais de refeições
- Dicas motivacionais
- Acompanhamento diário

### 6. 💪 Treinos Personalizados
- Vídeos de treino profissionais
- Opções por objetivo:
  - Perder peso
  - Definir músculos
  - Desinchar
- Níveis de dificuldade:
  - Iniciante
  - Intermediário
  - Avançado
- Sugestões geradas pela IA conforme perfil

### 7. 🍳 Receitas Inteligentes
- Chás para desinchar
- Receitas naturais de emagrecimento
- Refeições saudáveis e simples
- **IA gera receitas exclusivas** conforme objetivo
- Modo passo a passo detalhado

### 8. 💬 Assistente de IA (Coach Digital)
- Chat 24/7 para tirar dúvidas
- Respostas sobre dieta, treino e calorias
- Análise de evolução física
- Sugestões personalizadas em tempo real
- Funciona como um coach pessoal

### 9. 💳 Sistema de Planos Pagos

#### 📦 Plano Básico - R$ 29,90/mês
- ✅ Calorias por foto
- ✅ Cálculo de IMC
- ✅ Receitas simples
- ✅ Suporte básico

#### ⭐ Plano Plus - R$ 49,90/mês (Mais Popular)
- ✅ Tudo do Básico
- ✅ Evolução corporal por IA
- ✅ Receitas completas
- ✅ Alguns treinos em vídeo
- ✅ Relatórios mensais

#### 👑 Plano Premium - R$ 79,90/mês
- ✅ Acesso total ilimitado
- ✅ Treinos completos
- ✅ Receitas criadas pela IA
- ✅ Relatórios semanais
- ✅ Suporte completo da IA
- ✅ Planos 100% personalizados

### 10. 🎨 Design e Experiência
- Visual moderno e elegante
- Interface simples e profissional
- Layout limpo e responsivo
- Gradientes vibrantes (roxo/rosa)
- Animações suaves
- Experiência motivadora

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização moderna
- **Shadcn/ui** - Componentes UI profissionais

### Componentes UI
- Radix UI - Componentes acessíveis
- Lucide Icons - Ícones modernos
- Sonner - Notificações toast
- React Hook Form - Formulários
- Zod - Validação de dados

### Inteligência Artificial (Preparado para integração)
- OpenAI Vision API - Reconhecimento de imagens
- GPT-4 - Chat e geração de conteúdo
- Análise corporal com IA
- Cálculos nutricionais automatizados

---

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/fitai-pro.git

# 2. Entre na pasta do projeto
cd fitai-pro

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env.local

# 5. Execute o projeto em desenvolvimento
npm run dev

# 6. Acesse no navegador
http://localhost:3000
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# OpenAI API (para funcionalidades de IA)
OPENAI_API_KEY=sua_chave_aqui

# Supabase (opcional - para autenticação e banco de dados)
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui

# Stripe (opcional - para pagamentos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_aqui
STRIPE_SECRET_KEY=sua_chave_secreta_aqui
```

---

## 📱 Estrutura do Projeto

```
fitai-pro/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página inicial (landing page)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard do usuário
│   │   ├── layout.tsx            # Layout principal
│   │   └── globals.css           # Estilos globais
│   ├── components/
│   │   ├── ui/                   # Componentes Shadcn/ui
│   │   └── custom/               # Componentes customizados
│   ├── lib/
│   │   ├── utils.ts              # Funções utilitárias
│   │   └── fonts.ts              # Configuração de fontes
│   └── hooks/                    # React hooks customizados
├── public/                       # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🎯 Páginas e Rotas

### Página Inicial (`/`)
- Hero section com CTA
- Apresentação de recursos
- Planos e preços
- Formulário de cadastro
- Footer informativo

### Dashboard (`/dashboard`)
- Visão geral do progresso
- Upload de fotos de alimentos
- Upload de fotos corporais
- Biblioteca de treinos
- Receitas personalizadas
- Chat com IA
- Estatísticas diárias

---

## 🔧 Funcionalidades Técnicas

### Cálculos Automáticos

#### IMC (Índice de Massa Corporal)
```typescript
IMC = peso (kg) / altura² (m)
```

#### TMB (Taxa Metabólica Basal)
```typescript
// Homens
TMB = 88.362 + (13.397 × peso) + (4.799 × altura) - (5.677 × idade)

// Mulheres
TMB = 447.593 + (9.247 × peso) + (3.098 × altura) - (4.330 × idade)
```

#### Calorias Recomendadas
```typescript
Calorias = TMB × Fator de Atividade

// Para perder peso: -500 kcal
// Para ganhar massa: +300 kcal
// Para manter: manutenção
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# 1. Instale a CLI da Vercel
npm i -g vercel

# 2. Faça login
vercel login

# 3. Deploy
vercel
```

### Outras Plataformas
- **Netlify** - Suporte para Next.js
- **AWS Amplify** - Hospedagem escalável
- **Railway** - Deploy simplificado

---

## 🎨 Customização

### Cores do Tema

O projeto usa gradientes roxo/rosa como tema principal. Para customizar:

```css
/* src/app/globals.css */
.bg-gradient-primary {
  background: linear-gradient(to right, #a855f7, #ec4899);
}
```

### Fontes

Fontes disponíveis no template:
- Geist Sans (padrão)
- Geist Mono
- Inter
- Roboto
- Fira Code
- JetBrains Mono

---

## 📊 Roadmap Futuro

### Fase 1 - MVP (Concluído ✅)
- [x] Landing page responsiva
- [x] Sistema de cadastro
- [x] Dashboard básico
- [x] Cálculos de IMC/TMB
- [x] Interface de upload de fotos

### Fase 2 - Integrações IA (Em Desenvolvimento 🚧)
- [ ] Integração OpenAI Vision API
- [ ] Reconhecimento real de alimentos
- [ ] Análise corporal com IA
- [ ] Chat funcional com GPT-4
- [ ] Geração de receitas por IA

### Fase 3 - Backend Completo (Planejado 📋)
- [ ] Autenticação com Supabase
- [ ] Banco de dados de usuários
- [ ] Sistema de pagamentos (Stripe)
- [ ] Armazenamento de fotos
- [ ] Histórico de evolução

### Fase 4 - Apps Mobile (Futuro 🔮)
- [ ] App Android nativo
- [ ] App iOS nativo
- [ ] Sincronização entre dispositivos
- [ ] Notificações push

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com 💜 por **Lasy AI**

- Website: [https://lasy.ai](https://lasy.ai)
- GitHub: [@lasy-ai](https://github.com/lasy-ai)

---

## 📞 Suporte

Precisa de ajuda? Entre em contato:

- 📧 Email: suporte@fitaipro.com
- 💬 Discord: [FitAI Pro Community](https://discord.gg/fitaipro)
- 📱 WhatsApp: +55 (11) 99999-9999

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Estilização moderna
- [Lucide Icons](https://lucide.dev/) - Ícones lindos
- [Vercel](https://vercel.com/) - Hospedagem

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

Made with ❤️ and 🤖 AI

</div>
