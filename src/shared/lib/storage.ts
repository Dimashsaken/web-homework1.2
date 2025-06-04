import { Chat, Message } from '../types';

const STORAGE_KEYS = {
  CHATS: 'telegram-clone-chats',
  MESSAGES: 'telegram-clone-messages',
  ACTIVE_CHAT: 'telegram-clone-active-chat',
} as const;

export const storage = {
  // Chat storage
  getChats: (): Chat[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setChats: (chats: Chat[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to save chats:', error);
    }
  },

  // Messages storage
  getMessages: (): Record<string, Message[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (!stored) return {};
      
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      Object.keys(parsed).forEach(chatId => {
        parsed[chatId] = parsed[chatId].map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      });
      return parsed;
    } catch {
      return {};
    }
  },

  setMessages: (messages: Record<string, Message[]>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  },

  // Active chat storage
  getActiveChat: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT);
  },

  setActiveChat: (chatId: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT, chatId);
  },

  // Clear all data
  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}; 