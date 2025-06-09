import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { openaiService, OpenAIMessage } from '../openai';
import { Message, Chat } from '../../types';

// Query keys для кэширования
export const queryKeys = {
  chats: ['chats'] as const,
  chat: (id: string) => ['chat', id] as const,
  messages: (chatId: string) => ['messages', chatId] as const,
};

// Хук для отправки сообщения
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messages, 
      chatId, 
      isAI = true 
    }: { 
      messages: OpenAIMessage[]; 
      chatId: string; 
      isAI?: boolean;
    }) => {
      const response = await openaiService.sendMessage(messages, isAI);
      return { response, chatId };
    },
    onSuccess: (data) => {
      // Инвалидируем кэш сообщений для обновления UI
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.messages(data.chatId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.chats 
      });
    },
    onError: (error) => {
      console.error('Ошибка при отправке сообщения:', error);
    },
  });
};

// Хук для получения чатов (если они хранятся на сервере)
export const useChats = () => {
  return useQuery({
    queryKey: queryKeys.chats,
    queryFn: async (): Promise<Chat[]> => {
      // Здесь можно добавить реальный API вызов
      // Пока используем локальное хранилище
      const chats = localStorage.getItem('telegram-chats');
      return chats ? JSON.parse(chats) : [];
    },
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

// Хук для получения сообщений конкретного чата
export const useMessages = (chatId: string) => {
  return useQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: async (): Promise<Message[]> => {
      // Здесь можно добавить реальный API вызов
      // Пока используем локальное хранилище
      const messages = localStorage.getItem(`telegram-messages-${chatId}`);
      return messages ? JSON.parse(messages) : [];
    },
    enabled: !!chatId, // Запрос выполняется только если есть chatId
    staleTime: 1000 * 60 * 2, // 2 минуты
  });
};

// Хук для создания нового чата
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: Omit<Chat, 'id'>) => {
      // Здесь можно добавить реальный API вызов
      const newChat: Chat = {
        ...chatData,
        id: Date.now().toString(),
      };
      
      // Сохраняем в localStorage (в реальном приложении - API вызов)
      const existingChats = localStorage.getItem('telegram-chats');
      const chats = existingChats ? JSON.parse(existingChats) : [];
      chats.push(newChat);
      localStorage.setItem('telegram-chats', JSON.stringify(chats));
      
      return newChat;
    },
    onSuccess: () => {
      // Обновляем список чатов
      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
    },
  });
};

// Хук для обновления чата
export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, updates }: { chatId: string; updates: Partial<Chat> }) => {
      // Здесь можно добавить реальный API вызов
      const existingChats = localStorage.getItem('telegram-chats');
      const chats: Chat[] = existingChats ? JSON.parse(existingChats) : [];
      
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, ...updates } : chat
      );
      
      localStorage.setItem('telegram-chats', JSON.stringify(updatedChats));
      
      return updatedChats.find(chat => chat.id === chatId);
    },
    onSuccess: (_, variables) => {
      // Обновляем кэш
      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat(variables.chatId) });
    },
  });
}; 