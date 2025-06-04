import React, { useState, useEffect } from 'react';
import { Chat, Message, User } from '../shared/types';
import { storage } from '../shared/lib/storage';
import { openaiService } from '../shared/lib/openai';

// Basic components
const ChatList = ({ chats, activeChat, onChatSelect }: {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
}) => (
  <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
    </div>
    <div className="flex-1 overflow-y-auto">
      {chats.map(chat => (
        <div
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
            activeChat === chat.id ? 'bg-telegram-blue bg-opacity-10' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-telegram-blue rounded-full flex items-center justify-center text-white font-semibold">
              {chat.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
              {chat.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage.text}</p>
              )}
            </div>
            {chat.unreadCount > 0 && (
              <div className="bg-telegram-blue text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MessageBubble = ({ message, isOwn }: { message: Message; isOwn: boolean }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
    <div
      className={`max-w-xs px-4 py-2 rounded-2xl ${
        isOwn
          ? 'bg-telegram-blue text-white rounded-br-md'
          : 'bg-white text-gray-900 rounded-bl-md shadow-sm border'
      }`}
    >
      <p className="text-sm">{message.text}</p>
      <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

const ChatWindow = ({ 
  chat, 
  messages, 
  onSendMessage,
  isTyping 
}: {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Welcome to Telegram Clone</h2>
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="w-8 h-8 bg-telegram-blue rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
          {chat.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{chat.name}</h2>
          {chat.participants.some(p => p.isAI) && (
            <p className="text-xs text-telegram-blue">AI Assistant</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === 'user'}
          />
        ))}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm border text-sm">
              AI is typing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-telegram-blue focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-telegram-blue text-white px-6 py-2 rounded-full hover:bg-telegram-dark-blue focus:outline-none focus:ring-2 focus:ring-telegram-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedChats = storage.getChats();
    const savedMessages = storage.getMessages();
    const savedActiveChat = storage.getActiveChat();

    if (savedChats.length === 0) {
      // Create initial chats
      const initialChats: Chat[] = [
        {
          id: 'ai-assistant',
          name: 'AI Assistant',
          participants: [
            { id: 'user', name: 'You', isOnline: true, isAI: false },
            { id: 'ai', name: 'AI Assistant', isOnline: true, isAI: true }
          ],
          unreadCount: 0,
          isGroup: false
        },
        {
          id: 'friend-1',
          name: 'John Doe',
          participants: [
            { id: 'user', name: 'You', isOnline: true, isAI: false },
            { id: 'friend-1', name: 'John Doe', isOnline: false, isAI: false }
          ],
          unreadCount: 0,
          isGroup: false
        }
      ];
      setChats(initialChats);
      storage.setChats(initialChats);
    } else {
      setChats(savedChats);
    }

    setMessages(savedMessages);
    setActiveChat(savedActiveChat);
  }, []);

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    storage.setActiveChat(chatId);
    
    // Mark messages as read
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    );
    setChats(updatedChats);
    storage.setChats(updatedChats);
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: 'user',
      chatId: activeChat,
      timestamp: new Date(),
      isRead: false,
      isDelivered: true
    };

    // Add user message
    const updatedMessages = {
      ...messages,
      [activeChat]: [...(messages[activeChat] || []), newMessage]
    };
    setMessages(updatedMessages);
    storage.setMessages(updatedMessages);

    // Update last message in chat
    const updatedChats = chats.map(chat =>
      chat.id === activeChat ? { ...chat, lastMessage: newMessage } : chat
    );
    setChats(updatedChats);
    storage.setChats(updatedChats);

    // Handle AI response
    const currentChat = chats.find(chat => chat.id === activeChat);
    if (currentChat?.participants.some(p => p.isAI)) {
      setIsTyping(true);
      
      try {
        const aiResponse = await openaiService.sendMessage([
          { role: 'user', content: text }
        ]);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          senderId: 'ai',
          chatId: activeChat,
          timestamp: new Date(),
          isRead: false,
          isDelivered: true
        };

        const finalMessages = {
          ...updatedMessages,
          [activeChat]: [...updatedMessages[activeChat], aiMessage]
        };
        setMessages(finalMessages);
        storage.setMessages(finalMessages);

        const finalChats = chats.map(chat =>
          chat.id === activeChat ? { ...chat, lastMessage: aiMessage } : chat
        );
        setChats(finalChats);
        storage.setChats(finalChats);
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const currentChat = chats.find(chat => chat.id === activeChat) || null;
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div className="h-screen flex">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
      />
      <ChatWindow
        chat={currentChat}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  );
}; 