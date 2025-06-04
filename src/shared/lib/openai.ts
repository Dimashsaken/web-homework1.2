export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: OpenAIMessage[], isAI: boolean = true): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      // Return mock response if no API key is configured
      await this.delay(1000 + Math.random() * 2000); // Simulate network delay
      return isAI ? this.getMockAIResponse() : this.getMockJohnResponse();
    }

    try {
      const systemPrompt = isAI 
        ? { role: 'system' as const, content: 'You are a helpful AI assistant. Be concise and friendly.' }
        : { 
            role: 'system' as const, 
            content: `You are John Doe, a friendly 28-year-old software developer from San Francisco. 
            You work at a tech startup, love hiking, coffee, and video games. 
            You're casual in your communication, use emojis occasionally, and sometimes share personal experiences about coding, travel, or your hobbies. 
            Keep responses conversational and authentic, as if talking to a close friend.` 
          };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [systemPrompt, ...messages],
          max_tokens: isAI ? 150 : 200,
          temperature: isAI ? 0.7 : 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your message.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I encountered an error. Please try again later.';
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getMockAIResponse(): string {
    const responses = [
      "That's an interesting question! Let me think about it...",
      "I understand what you're asking. Here's my perspective...",
      "Thanks for sharing that with me. I'd be happy to help!",
      "Great question! Let me provide you with some information...",
      "I see what you mean. That's definitely worth considering.",
      "That's a thoughtful observation. Here are my thoughts...",
      "Interesting point! I think there are several ways to look at this...",
      "I appreciate you asking. Based on my understanding...",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getMockJohnResponse(): string {
    const responses = [
      "Hey! That's actually pretty cool 😄 I was just working on something similar at the office!",
      "Haha, I totally get what you mean! Had the same thing happen to me last week.",
      "That reminds me of when I went hiking in Yosemite last month... the view was incredible! 🏔️",
      "Oh man, you should try the new coffee place downtown! Their cold brew is amazing ☕",
      "I've been playing this new indie game lately - it's surprisingly addictive! What about you?",
      "Work's been crazy busy with our latest release, but it's exciting stuff! How's your day going?",
      "That's a smart approach! I usually do something similar when I'm debugging code.",
      "Totally! I remember reading about that. It's fascinating how technology keeps evolving 🚀",
      "Sounds like a plan! I'm always down for trying new things. Life's too short, right?",
      "I can relate! Sometimes I feel like my code has a mind of its own 😅"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Create a singleton instance
export const openaiService = new OpenAIService(
  process.env.REACT_APP_OPENAI_API_KEY || 'your_openai_api_key_here'
); 