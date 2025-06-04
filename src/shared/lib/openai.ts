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

  async sendMessage(messages: OpenAIMessage[]): Promise<string> {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      // Return mock response if no API key is configured
      await this.delay(1000 + Math.random() * 2000); // Simulate network delay
      return this.getMockResponse();
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 150,
          temperature: 0.7,
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

  private getMockResponse(): string {
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
}

// Create a singleton instance
export const openaiService = new OpenAIService(
  process.env.REACT_APP_OPENAI_API_KEY || 'your_openai_api_key_here'
); 