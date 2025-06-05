import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat, Message } from '../shared/types';
import { storage } from '../shared/lib/storage';
import { openaiService } from '../shared/lib/openai';
import { ThemeProvider, useTheme } from '../shared/lib/theme';

// Icons components
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

const RestartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChatList = ({ 
  chats, 
  activeChat, 
  onChatSelect, 
  theme, 
  isOpen, 
  onClose,
  toggleTheme
}: {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (chatId: string) => void;
  theme: 'light' | 'dark';
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
}) => (
  <>
    {/* Mobile Overlay */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
    </AnimatePresence>

    {/* Chat List */}
    <motion.div
      initial={false}
      animate={{
        x: window.innerWidth >= 1024 ? 0 : (isOpen ? 0 : '-100%')
      }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={`
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        w-80 sm:w-96 lg:w-80 xl:w-96 h-full
        border-r flex flex-col
        ${theme === 'dark' 
          ? 'bg-dark-bg border-dark-border' 
          : 'bg-white border-gray-200'
        }
      `}
    >
      <div className={`p-3 sm:p-4 border-b flex items-center justify-between ${
        theme === 'dark' ? 'border-dark-border' : 'border-gray-200'
      }`}>
        <h1 className={`text-lg sm:text-xl font-semibold ${
          theme === 'dark' ? 'text-dark-text' : 'text-gray-900'
        }`}>Chats</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-dark-bg-tertiary text-dark-text' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded-md ${
              theme === 'dark' 
                ? 'hover:bg-dark-bg-tertiary text-dark-text-secondary' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {chats.map(chat => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                onChatSelect(chat.id);
                if (window.innerWidth < 1024) {
                  onClose(); // Only close sidebar on mobile/tablet after selection
                }
              }}
              className={`p-3 sm:p-4 border-b cursor-pointer transition-colors ${
                theme === 'dark' 
                  ? `border-dark-border hover:bg-dark-bg-secondary ${
                      activeChat === chat.id ? 'bg-telegram-blue bg-opacity-20' : ''
                    }`
                  : `border-gray-100 hover:bg-gray-50 ${
                      activeChat === chat.id ? 'bg-telegram-blue bg-opacity-10' : ''
                    }`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-telegram-blue rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm sm:text-base font-medium truncate ${
                    theme === 'dark' ? 'text-dark-text' : 'text-gray-900'
                  }`}>{chat.name}</p>
                  {chat.lastMessage && (
                    <p className={`text-xs sm:text-sm truncate ${
                      theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-500'
                    }`}>{chat.lastMessage.text}</p>
                  )}
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-telegram-blue text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center flex-shrink-0">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  </>
);

const MessageBubble = ({ message, isOwn, theme }: { 
  message: Message; 
  isOwn: boolean;
  theme: 'light' | 'dark';
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
  >
    <div
      className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm px-3 sm:px-4 py-2 rounded-2xl ${
        isOwn
          ? theme === 'dark'
            ? 'bg-chat-message-out-dark text-white rounded-br-md'
            : 'bg-telegram-blue text-white rounded-br-md'
          : theme === 'dark'
            ? 'bg-chat-message-in-dark text-dark-text rounded-bl-md'
            : 'bg-white text-gray-900 rounded-bl-md shadow-sm border'
      }`}
    >
      <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
      <p className={`text-xs mt-1 ${
        isOwn 
          ? theme === 'dark' ? 'text-gray-300' : 'text-blue-100'
          : theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-500'
      }`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </motion.div>
);

const ChatWindow = ({ 
  chat, 
  messages, 
  onSendMessage,
  onRestartConversation,
  isTyping,
  theme,
  searchQuery,
  onSearchChange,
  onOpenSidebar
}: {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onRestartConversation: () => void;
  isTyping: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSidebar: () => void;
}) => {
  const [inputText, setInputText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return messages;
    return messages.filter(msg => 
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  if (!chat) {
    return (
      <div className={`flex-1 flex flex-col ${
        theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-gray-50'
      }`}>
        {/* Mobile Header */}
        <div className={`lg:hidden border-b px-4 py-3 flex items-center ${
          theme === 'dark' 
            ? 'bg-dark-bg border-dark-border' 
            : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={onOpenSidebar}
            className={`p-2 rounded-full mr-2 ${
              theme === 'dark' 
                ? 'hover:bg-dark-bg-tertiary text-dark-text' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <MenuIcon />
          </button>
          <h1 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-dark-text' : 'text-gray-900'
          }`}>Chats</h1>
        </div>

        {/* Welcome Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <h2 className={`text-xl sm:text-2xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-600'
            }`}>Welcome to Telegram Clone</h2>
            <p className={`text-sm sm:text-base ${
              theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-500'
            }`}>
              Select a chat to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      key={chat.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-w-0"
    >
      {/* Chat Header */}
      <div className={`border-b px-3 sm:px-4 py-3 flex items-center justify-between ${
        theme === 'dark' 
          ? 'bg-dark-bg border-dark-border' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center min-w-0 flex-1">
          <button
            onClick={onOpenSidebar}
            className={`lg:hidden p-2 rounded-full mr-2 -ml-2 ${
              theme === 'dark' 
                ? 'hover:bg-dark-bg-tertiary text-dark-text' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <MenuIcon />
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-telegram-blue rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
            {chat.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={`font-semibold text-sm sm:text-base truncate ${
              theme === 'dark' ? 'text-dark-text' : 'text-gray-900'
            }`}>{chat.name}</h2>
            {chat.participants.some(p => p.isAI) && (
              <p className="text-xs text-telegram-blue">AI Assistant</p>
            )}
          </div>
          <button
            onClick={onRestartConversation}
            className={`p-2 rounded-full transition-colors ml-2 ${
              theme === 'dark' 
                ? 'hover:bg-dark-bg-tertiary text-dark-text-secondary' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Restart conversation"
          >
            <RestartIcon />
          </button>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors ml-1 ${
              theme === 'dark' 
                ? 'hover:bg-dark-bg-tertiary text-dark-text-secondary' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <SearchIcon />
          </button>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`border-b px-3 sm:px-4 py-3 ${
              theme === 'dark' 
                ? 'bg-dark-bg border-dark-border' 
                : 'bg-white border-gray-200'
            }`}
          >
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-telegram-blue ${
                theme === 'dark'
                  ? 'bg-dark-bg-tertiary border-dark-border text-dark-text'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-3 sm:p-4 ${
        theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-gray-50'
      }`}>
        <AnimatePresence>
          {filteredMessages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === 'user'}
              theme={theme}
            />
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-3"
          >
            <div className={`px-3 sm:px-4 py-2 rounded-2xl rounded-bl-md text-sm ${
              theme === 'dark'
                ? 'bg-chat-message-in-dark text-dark-text-secondary'
                : 'bg-white text-gray-500 shadow-sm border'
            }`}>
              {chat.participants.some(p => p.isAI) ? 'AI is typing...' : `${chat.name} is typing...`}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className={`border-t px-3 sm:px-4 py-3 ${
        theme === 'dark' 
          ? 'bg-dark-bg border-dark-border' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex space-x-2 sm:space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-full focus:outline-none focus:ring-2 focus:ring-telegram-blue focus:border-transparent ${
              theme === 'dark'
                ? 'bg-dark-bg-tertiary border-dark-border text-dark-text placeholder-dark-text-secondary'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-telegram-blue text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full hover:bg-telegram-dark-blue focus:outline-none focus:ring-2 focus:ring-telegram-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Always open on desktop
      } else {
        setSidebarOpen(false); // Closed by default on mobile/tablet
      }
    };

    // Set initial state
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setSearchQuery(''); // Clear search when switching chats
    storage.setActiveChat(chatId);
    
    // Mark messages as read
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    );
    setChats(updatedChats);
    storage.setChats(updatedChats);
  };

  const handleRestartConversation = () => {
    if (!activeChat) return;
    
    // Clear messages for the active chat
    const updatedMessages = {
      ...messages,
      [activeChat]: []
    };
    setMessages(updatedMessages);
    storage.setMessages(updatedMessages);

    // Clear last message in chat
    const updatedChats = chats.map(chat =>
      chat.id === activeChat ? { ...chat, lastMessage: undefined } : chat
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

    // Handle responses (AI or John Doe)
    const currentChat = chats.find(chat => chat.id === activeChat);
    if (currentChat && (currentChat.participants.some(p => p.isAI) || currentChat.id === 'friend-1')) {
      setIsTyping(true);
      
      try {
        const isAI = currentChat.participants.some(p => p.isAI);
        const response = await openaiService.sendMessage([
          { role: 'user', content: text }
        ], isAI);

        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          senderId: isAI ? 'ai' : 'friend-1',
          chatId: activeChat,
          timestamp: new Date(),
          isRead: false,
          isDelivered: true
        };

        const finalMessages = {
          ...updatedMessages,
          [activeChat]: [...updatedMessages[activeChat], responseMessage]
        };
        setMessages(finalMessages);
        storage.setMessages(finalMessages);

        const finalChats = chats.map(chat =>
          chat.id === activeChat ? { ...chat, lastMessage: responseMessage } : chat
        );
        setChats(finalChats);
        storage.setChats(finalChats);
      } catch (error) {
        console.error('Failed to get response:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const currentChat = chats.find(chat => chat.id === activeChat) || null;
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  return (
    <div className={`h-screen flex overflow-hidden ${theme === 'dark' ? 'bg-dark-bg text-dark-text' : 'bg-white text-gray-900'}`}>
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        theme={theme}
        isOpen={sidebarOpen}
        onClose={() => {
          if (window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
        toggleTheme={toggleTheme}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          chat={currentChat}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onRestartConversation={handleRestartConversation}
          isTyping={isTyping}
          theme={theme}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}; 