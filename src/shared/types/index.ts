export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isAI?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  chatId: string;
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  name: string;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  avatar?: string;
}

export interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
} 