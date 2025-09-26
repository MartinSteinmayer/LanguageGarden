# 🌍 Language Garden

**Preserving endangered languages through AI-powered voice conversations**

> *"Every language is a temple, in which the soul of those who speak it is enshrined."* — Oliver Wendell Holmes, Sr.

## 🚀 Live Demo
Experience Language Garden at **[languagegarden.vercel.app](https://languagegarden.vercel.app/)**

---

## 🎯 Our Mission

Language Garden is an interactive 3D globe that strives to bring endangered and severely endangered languages back to life through AI voice technology. We're hope to use digital tools to ensure, that linguistic heritage never truly dies.

### The Problem
- **3,000+ languages** are critically endangered worldwide
- Many have **fewer than 1,000 speakers** remaining  
- Traditional preservation methods can't capture the living essence of spoken language

### Our Solution
Using **ElevenLabs' advanced voice AI**, we've created conversational agents for endangered languages, allowing people to:
- 🗣️ **Practice conversation** in their ancestral languages
- 🎯 **Learn cultural context** from native AI storytellers  
- 💝 **Support preservation efforts** through direct donations
- 🌐 **Explore linguistic diversity** on an interactive globe

---

## ⚡ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **3D Visualization**: Mapbox GL JS (Globe projection with atmosphere)
- **Voice AI**: ElevenLabs Conversational AI (70+ languages, 3000+ voices)
- **Payments**: Stripe (TODO)
- **Translation**: Google Translate API
- **Deployment**: Vercel

---

## 🎤 ElevenLabs Integration

We've leveraged ElevenLabs at scale to create the world's most comprehensive endangered language voice platform:

- **70+ Languages** with voice AI capabilities
- **3,000+ Voice Models** across different dialects and regions
- **Dynamic Voice Selection** based on geographic location
- **Cultural Storytelling** agents that share traditions, folklore, and customs
- **Real-time Translation** with English subtitles for accessibility

Each language conversation is powered by carefully crafted prompts that encourage cultural exchange and authentic linguistic practice.

---

## 🗺️ Interactive Features

### Language Status Visualization
- 🟢 **Green Dots**: Voice chat available (preserved languages)
- 🟡 **Yellow Dots**: Definitely endangered (needs support)
- 🔴 **Red Dots**: Severely endangered (urgent preservation needed)

### Voice Conversations
- Talk in English, AI responds in the target language
- Learn about cultural traditions, food, music, and history
- Practice pronunciation with native-sounding AI voices
- Get real-time translations and cultural context

### Donation Integration
- Direct support for language preservation projects
- Transparent funding for digital archiving efforts
- Community-driven language revitalization programs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended)
- ElevenLabs API key
- Mapbox access token

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/language-garden
cd language-garden

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup

```bash
# Required API keys
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_ELEVENLABS_BASE_AGENT_ID=your_agent_id
NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_translate_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the interactive globe.

---

## 🌟 Impact & Vision

Language Garden represents the future of linguistic preservation—where AI doesn't replace human culture, but amplifies and preserves it for future generations. By making endangered languages accessible through voice AI, we're ensuring that linguistic diversity remains a living, breathing part of our global heritage.

**Join us in preserving the world's linguistic treasures, one conversation at a time.**

---

## 📞 Built With Love

Created during a 2-day hackathon, powered by the belief that technology can preserve humanity's most precious asset: our languages.

**Tech Partner**: [ElevenLabs](https://elevenlabs.io) - Enabling voice AI for 70+ endangered languages