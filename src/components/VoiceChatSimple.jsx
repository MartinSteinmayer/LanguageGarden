"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Generate custom prompt for the language assistant
const getPrompt = (language) => {
    const languageName = language.name;
    const officialName = language.officialName || languageName;
    const dialect = language.dialect || "standard";
    const speakers = language.speakers ? `spoken by ${language.speakers.toLocaleString()} people` : "";

    return `You are a cultural ambassador and enthusiastic storyteller for ${languageName}-speaking cultures. Your role is to share fascinating insights about the rich heritage, traditions, and modern life of ${languageName} speakers.

LANGUAGE: Always respond in ${languageName} (${officialName}), using the ${dialect} dialect.

PERSONALITY:
- Be passionate and knowledgeable about ${languageName} culture
- Share stories with warmth and enthusiasm
- Be curious about the user's cultural background too
- Celebrate the diversity and richness of ${languageName} cultures

CONVERSATION STYLE:
- Share captivating stories about traditions, festivals, and customs
- Discuss famous literature, music, films, and art from ${languageName} cultures
- Explain historical events and their cultural significance
- Talk about modern life, social customs, and contemporary issues
- Share interesting expressions, proverbs, and their cultural meanings
- Ask about the user's own culture to create cultural exchange

CULTURAL FOCUS:
- Food traditions and regional specialties
- Religious and spiritual practices
- Art, architecture, and design
- Music, dance, and performing arts
- Historical figures and legends
- Regional differences and local customs
- Modern cultural movements and trends

Remember: Your goal is to be a window into the fascinating world of ${languageName} cultures, making every conversation a cultural journey of discovery!

ALWAYS ANSWER IN ${languageName} (${officialName})! EMPHASIZE IN THE DIALECT!

`;
};

const getFirstMessage = (language) => {
    const languageName = language.name;
    const mapping = {
        es: "¡Hola! Me alegra que quieras practicar español conmigo. ¿Cómo te gustaría empezar nuestra conversación hoy?",
        fr: "Bonjour! Je suis ravi que vous souhaitiez pratiquer le français avec moi. Comment aimeriez-vous commencer notre conversation aujourd'hui?",
        de: "Hallo! Ich freue mich, dass du mit mir Deutsch üben möchtest. Wie möchtest du unser Gespräch heute beginnen?",
        it: "Ciao! Sono felice che tu voglia praticare l'italiano con me. Come vorresti iniziare la nostra conversazione oggi?",
        pt: "Olá! Fico feliz que você queira praticar português comigo. Como você gostaria de começar nossa conversa hoje?",
        zh: "你好！很高兴你想和我练习中文。你今天想怎么开始我们的对话？",
        ja: "こんにちは！私と一緒に日本語を練習したいと思ってくれて嬉しいです。今日はどのように会話を始めたいですか？",
        ko: "안녕하세요! 저와 함께 한국어를 연습하고 싶다니 기쁩니다. 오늘 대화를 어떻게 시작하고 싶으신가요?",
        ru: "Привет! Я рад, что ты хочешь практиковать русский язык со мной. Как бы ты хотел начать наш разговор сегодня?",
        ar: "مرحبًا! أنا سعيد لأنك ترغب في ممارسة اللغة العربية معي. كيف تود أن نبدأ محادثتنا اليوم؟",
        hi: "नमस्ते! मुझे खुशी है कि आप मेरे साथ हिंदी का अभ्यास करना चाहते हैं। आप आज हमारी बातचीत कैसे शुरू करना चाहेंगे?",
        en: "Hello! I'm glad you want to practice English with me. How would you like to start our conversation today?",
    };

    // Return the mapped message or fallback to English with the language name
    return (
        mapping[language.iso6393] ||
        `Hello! I'm glad you want to practice ${languageName} with me. How would you like to start our conversation today?`
    );
};

const VoiceChat = ({ language, onClose }) => {
    // Initialize conversation exactly like official docs
    const conversation = useConversation({
        onConnect: () => console.log("Connected"),
        onDisconnect: () => console.log("Disconnected"),
        onMessage: (message) => console.log("Message:", message),
        onError: (error) => console.error("Error:", error),
    });

    const startConversation = useCallback(async () => {
        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            console.log("🔍 Language object for voice chat:", language);
            console.log("🔍 Language keys:", Object.keys(language));
            console.log("🔍 voice_ids:", language.voice_ids);
            console.log("🔍 iso6393:", language.iso6393);

            // Safely get voice ID
            let voiceId = null;
            if (language.voice_ids) {
                if (Array.isArray(language.voice_ids)) {
                    voiceId = language.voice_ids[0];
                } else if (typeof language.voice_ids === "string") {
                    try {
                        const parsedVoiceIds = JSON.parse(language.voice_ids);
                        voiceId = Array.isArray(parsedVoiceIds) ? parsedVoiceIds[0] : null;
                    } catch (e) {
                        console.error("Failed to parse voice_ids:", e);
                    }
                }
            }

            console.log("🎤 Selected voice ID:", voiceId);
            console.log("🌍 Language code:", language.iso6393);

            // Build overrides object - only include fields that have valid values
            const overrides = {
                agent: {
                    prompt: {
                        prompt: getPrompt(language),
                    },
                },
            };

            // Only add language if it exists and is valid
            if (language.iso6393 && language.iso6393 !== "multiple") {
                overrides.agent.language = language.iso6393;
            }

            // Only add voice if we have a valid voice ID

            console.log("🚀 Starting session with overrides:", overrides);
            console.log("🔑 Agent ID:", process.env.NEXT_PUBLIC_ELEVENLABS_BASE_AGENT_ID);

            // Start the conversation with your agent
            await conversation.startSession({
                agentId: process.env.NEXT_PUBLIC_ELEVENLABS_BASE_AGENT_ID,
                overrides: overrides,
            });

            console.log("✅ Session started successfully!");
        } catch (error) {
            console.error("❌ Failed to start conversation:", error);
            console.error("❌ Error details:", error.message);
            console.error("❌ Error stack:", error.stack);
            console.error("❌ Full error object:", error);

            // Check for specific error types
            if (error.message?.includes("override")) {
                console.error("🚨 OVERRIDE ERROR: This suggests overrides are not enabled in your agent settings");
                console.error(
                    "🔧 Fix: Go to https://elevenlabs.io/app/agents, select your agent, go to Security tab, and enable overrides for: System prompt, First message, Language, Voice ID"
                );
            }

            if (error.message?.includes("agent")) {
                console.error("🚨 AGENT ERROR: Check if your agent ID is correct and the agent exists");
                console.error(
                    "🔗 Agent URL: https://elevenlabs.io/app/talk-to?agent_id=" +
                        process.env.NEXT_PUBLIC_ELEVENLABS_BASE_AGENT_ID
                );
            }
        }
    }, [conversation, language]);

    const stopConversation = useCallback(async () => {
        await conversation.endSession();
    }, [conversation]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl relative">
                {/* Close Button */}
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </Button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Chat</h2>
                    <p className="text-gray-600">
                        Practice <span className="font-semibold text-blue-600">{language.name}</span>
                    </p>
                    {language.officialName && <p className="text-sm text-gray-500 mt-1">{language.officialName}</p>}
                </div>

                {/* Simple Status and Controls following official docs pattern */}
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="flex gap-2">
                        <Button
                            onClick={startConversation}
                            disabled={conversation.status === "connected"}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            Start Conversation
                        </Button>
                        <Button
                            onClick={stopConversation}
                            disabled={conversation.status !== "connected"}
                            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
                        >
                            Stop Conversation
                        </Button>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <p className="text-gray-700">Status: {conversation.status}</p>
                        <p className="text-gray-600">Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
                        <p className="text-sm text-gray-500 mt-2">Speaking in {language.name}</p>
                    </div>
                </div>

                {/* Close Button */}
                <div className="text-center">
                    <Button onClick={onClose} variant="outline" className="px-6 py-2">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VoiceChat;
