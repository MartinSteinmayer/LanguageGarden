"use client";

import { ElevenLabsProvider } from '@elevenlabs/react';

export default function ElevenLabsProviderWrapper({ children }) {
  return (
    <ElevenLabsProvider
      publicKey={process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY}
      agentId={process.env.NEXT_PUBLIC_ELEVENLABS_BASE_AGENT_ID}
    >
      {children}
    </ElevenLabsProvider>
  );
}
