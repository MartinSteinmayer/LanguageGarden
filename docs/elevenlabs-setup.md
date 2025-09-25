# ElevenLabs Voice Chat Setup Guide

This guide will help you set up multilingual voice chat for your World Languages application using ElevenLabs voices and a single base agent.

## Prerequisites

1. ElevenLabs account (sign up at https://elevenlabs.io/sign-up)
2. API key (get from https://elevenlabs.io/settings/api-keys)

## Step 1: Create a Base Multilingual Agent

Instead of creating separate agents for each language, we'll create one base agent that dynamically adapts to different languages and voices:

### 1. Go to ElevenLabs Agents Dashboard
Visit: https://elevenlabs.io/app/agents

### 2. Create a New Agent
Click "Create Agent" and select "Blank template"

### 3. Configure the Base Agent

- **Name**: "Multilingual Language Teacher"
- **First Message**: "Hello! I'm your language learning assistant. I can help you practice many languages!"
- **System Prompt**:
```
You are a friendly multilingual language assistant. You help users practice conversation in various languages.

Guidelines:
- Respond in the language the user is learning/practicing
- Speak clearly and at a moderate pace
- Be patient and encouraging
- Help with pronunciation, grammar, and vocabulary
- Keep responses conversational and engaging
- Adapt your language level to match the user's proficiency
- Be culturally aware and respectful
- If you don't understand something, ask for clarification in the target language
```
- **Voice**: Select any default voice (this will be overridden dynamically)
- **Language**: English (this will be overridden dynamically)

### 4. Test the Agent
Use the "Test AI agent" button to verify the agent works correctly.

### 5. Get Agent ID
Copy the Agent ID from the agent settings page - you'll need this for your environment variables.

## Step 2: Update Environment Variables

Add the Base Agent ID to your `.env.local` file:

```bash
NEXT_PUBLIC_ELEVENLABS_BASE_AGENT_ID=your_actual_base_agent_id
```

The system will automatically use the voice IDs from your `eleven_lab_voices_coordinates.json` file to provide the appropriate voice for each language variant.

## Step 3: How It Works

The system works by:

1. **Dynamic Voice Selection**: Each language variant in your JSON file has associated `voice_ids`. The system automatically selects the first available voice ID for the chosen language.

2. **Dynamic Prompts**: The system generates language-specific prompts and first messages based on the selected language.

3. **Dynamic Overrides**: The ElevenLabs agent is dynamically configured with:
   - The appropriate voice ID from your voice data
   - A language-specific system prompt
   - A greeting in the target language
   - The correct language code

## Step 4: Voice Data Structure

Your voice data should be structured like this in `eleven_lab_voices_coordinates.json`:

```json
{
  "es": {
    "mexican": {
      "voice_ids": ["voice_id_1", "voice_id_2", ...],
      "name": "Mexican Spanish",
      "official_name": "Español Mexicano",
      "coordinates": { "lat": "23.6345", "long": "-102.5528" }
    }
  }
}
```

## Step 5: Testing

1. Start your development server: `pnpm dev`
2. Click on a language dot on the map
3. Click "Start Voice Chat"
4. Test the conversation in each language

## Troubleshooting

- **"Agent ID not found"**: Double-check the Agent ID in your environment variables
- **"Permission denied"**: Ensure microphone permissions are granted
- **"Connection failed"**: Verify your API key and internet connection
- **Wrong language response**: Check the system prompt and voice selection

## Next Steps

1. Create agents for additional languages as needed
2. Customize system prompts based on user feedback
3. Add language-specific tools and knowledge bases
4. Monitor conversation analytics in the ElevenLabs dashboard
