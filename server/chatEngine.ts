import { getGeminiClient } from './gemini';
import { GeneralChatMode } from '../src/types';

export interface GeneralChatRequest {
  message: string;
  mode: GeneralChatMode;
  funAction?: 'challenge' | 'quiz' | 'random_fact' | 'debate' | 'brainstorm';
  history?: { role: 'user' | 'assistant'; content: string }[];
  topic?: string;
}

export class ChatEngine {
  public async handleChat(request: GeneralChatRequest): Promise<string> {
    const { message, mode, funAction, history = [], topic } = request;
    const ai = getGeminiClient();

    let systemInstruction = `You are KITTAB's AI Study Companion & General Chatbot.
Your personality is:
- A smart, enthusiastic, and supportive study buddy (not a dry corporate bot, nor childish).
- Clear, articulate, intellectually curious, and encouraging.
- Format responses beautifully with markdown, bullet points, and code blocks where relevant.
- Keep responses engaging, insightful, and concise by default, while going deep when requested.`;

    let prompt = message;

    if (funAction === 'challenge') {
      prompt = `Give the user an intriguing challenge (such as a clever riddle, logic puzzle, brain teaser, or coding puzzle).
Topic: ${topic || 'General Curiosity'}.
Format:
1. State the challenge clearly.
2. Provide a subtle hint beneath a "Need a hint?" spoiler tag.
3. Invite the user to share their guess!`;
    } else if (funAction === 'quiz') {
      prompt = `Generate a fast, interactive 3-question mini-quiz on "${topic || 'General Science & Technology'}".
Provide 3 multiple choice questions with A, B, C, D options.
Do not reveal the answers immediately; ask the user to reply with their choices (e.g., A, C, B)!`;
    } else if (funAction === 'random_fact') {
      prompt = `Share an astonishing, little-known scientific, historical, or technological fact that sparks genuine curiosity.
Explain the fascinating "why" behind it in 2-3 engaging paragraphs.`;
    } else if (funAction === 'debate') {
      prompt = `Analyze both sides of the topic: "${message || topic || 'Artificial General Intelligence Timeline'}".
Present a balanced, educational perspective:
- Perspective A: Core arguments and supporting evidence.
- Perspective B: Counterarguments and caveats.
- Synthesis: What thoughtful researchers and practitioners consider.`;
    } else if (funAction === 'brainstorm') {
      prompt = `Act as an elite innovation and study strategist. Help brainstorm ideas for: "${message || topic}".
Structure:
1. 💡 Creative Angles & Core Ideas
2. ⚖️ Pros and Cons of each approach
3. 🚀 Recommended Next Steps & MVPs`;
    } else {
      // Mode-based instructions
      switch (mode) {
        case 'study_assistant':
          systemInstruction += ` You are acting as an academic study tutor. Break down difficult concepts into logical steps, provide memory aids/mnemonics, and test the user's comprehension.`;
          break;
        case 'creative':
          systemInstruction += ` You are in Creative Mode. Use vivid imagery, engaging analogies, thought experiments, and creative writing to bring ideas to life.`;
          break;
        case 'brainstorm':
          systemInstruction += ` You are in Brainstorm Mode. Provide innovative, out-of-the-box suggestions, alternative frameworks, and structured evaluation rubrics.`;
          break;
        case 'explain_anything':
          systemInstruction += ` You are in "Explain Anything" mode. Explain complex topics using the Feynman Technique—simple everyday metaphors, clear language, zero unexplained jargon.`;
          break;
        default:
          systemInstruction += ` Provide friendly, smart, and comprehensive conversation on any topic requested.`;
          break;
      }
    }

    if (ai) {
      try {
        const fullPrompt = `${systemInstruction}\n\nRecent History:\n${history
          .slice(-6)
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n')}\n\nUSER: ${prompt}`;

        const resp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
        });

        if (resp.text) {
          return resp.text;
        }
      } catch (err: any) {
        console.warn('General AI Chat error:', err.message);
      }
    }

    // Local smart buddy fallback response
    if (funAction === 'random_fact') {
      return `💡 **Fascinating Fact:** Honey never spoils. Archaeologists excavating 3,000-year-old Egyptian tombs have found pots of honey that are still completely edible!\n\n**Why?** Honey's extremely low moisture content (around 17%) combined with high acidity (pH ~3.9) and naturally occurring trace hydrogen peroxide created by bee enzymes creates an inhospitable environment where bacteria and fungi cannot survive.`;
    } else if (funAction === 'challenge') {
      return `🧠 **Logic Brain Teaser:**\n\nYou have two ropes, each of which takes exactly 60 minutes to burn completely from end to end. However, the ropes burn inconsistently (one half might burn in 10 minutes while the other half takes 50 minutes).\n\n**How can you measure exactly 45 minutes using only these two ropes and a lighter?**\n\n*Drop your answer below to see if you cracked it!*`;
    } else {
      return `Hello! I'm KITTAB's AI Study Companion. How can I help you learn, brainstorm, or explore today?\n\n- You can ask questions about any subject.\n- Ask me to generate challenges or quizzes.\n- Or brainstorm project ideas and study roadmaps!`;
    }
  }
}

export const globalChatEngine = new ChatEngine();
