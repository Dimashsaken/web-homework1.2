# Telegram Clone - Advanced Messenger with AI Integration

A modern web messenger application inspired by Telegram, featuring real-time chat with human contacts and AI assistant integration, with advanced features like dark theme, animations, and message search.

## 🚀 Features

### ✅ **Core Features**
- **Modern Telegram-like UI** with clean, responsive design
- **AI Chat Integration** with OpenAI GPT-3.5-turbo
- **John Doe Personality Simulation** - realistic human-like responses
- **Real-time messaging** simulation
- **Persistent chat history** using localStorage
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Feature-Sliced Design** architecture

### 🎯 **Advanced Features**
- **🌙 Dark/Light Theme Toggle** with smooth transitions
- **✨ Smooth Animations** using Framer Motion
- **🔍 Message Search** within conversations
- **🔄 Restart Conversation** functionality
- **📱 Responsive Design** for mobile devices
- **⚡ Auto-scroll** to latest messages
- **💬 Typing Indicators** for AI and human responses

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
# Copy this to .env file
REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
REACT_APP_APP_NAME=Telegram Clone
REACT_APP_AI_BOT_NAME=AI Assistant
```

**Note:** If you don't have an OpenAI API key, the app will work with realistic mock responses for both AI and John Doe.

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📱 Usage Guide

### **Basic Navigation**
1. **Chat Selection**: Click on any chat from the left sidebar
2. **Send Messages**: Type your message and click "Send" or press Enter
3. **Theme Toggle**: Click the moon/sun icon in the top-right corner
4. **Message Search**: Click the search icon in chat header
5. **Restart Chat**: Click the restart icon to clear conversation history

### **Chat Types**
- **AI Assistant**: Intelligent responses using OpenAI GPT-3.5-turbo
- **John Doe**: Simulated human friend with personality and context

### **Advanced Features**
- **Search Messages**: Find specific content within conversations
- **Dark Theme**: Easy on the eyes for low-light usage
- **Smooth Animations**: Enhanced user experience with transitions
- **Auto-scroll**: Automatically scroll to new messages

## 🏗 Architecture

The project follows Feature-Sliced Design methodology:

```
src/
├── app/           # Application layer (main App component)
├── shared/        # Shared utilities, types, and services
│   ├── types/     # TypeScript interfaces
│   └── lib/       # Utilities (storage, OpenAI service, theme)
```

## 🎨 Design System

- **Primary Color**: Telegram Blue (#0088cc)
- **Typography**: Inter font family
- **Dark Theme**: Custom dark color palette
- **Layout**: Responsive design with mobile support
- **Animations**: Framer Motion for smooth transitions
- **Components**: Reusable, typed React components

## 🤖 AI Integration

### **AI Assistant**
- Real OpenAI GPT-3.5-turbo API integration
- Concise and helpful responses
- Professional assistant personality

### **John Doe Simulation**
- 28-year-old software developer from San Francisco
- Works at a tech startup
- Loves hiking, coffee, and video games
- Casual, friendly communication style
- Uses emojis and shares personal experiences
- Realistic conversation patterns

### **Fallback System**
- Mock responses when no API key provided
- Different response patterns for AI vs. human
- Realistic typing delays
- Error handling for API failures

## 📦 Dependencies

- **React 18+** - Modern React with hooks
- **TypeScript** - Type safety
- **React Router DOM** - Navigation
- **React Hook Form** - Form handling
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🎯 Key Implementation Details

### **Theme System**
- CSS custom properties for colors
- Local storage persistence
- Smooth transitions between themes
- Dark mode optimized for readability

### **Animation System**
- Page transitions between chats
- Message entrance animations
- Search bar slide animations
- Typing indicator animations

### **Search Functionality**
- Real-time message filtering
- Case-insensitive search
- Highlighted results
- Persistent across chat switches

### **John Doe Personality**
- Context-aware responses
- Personality traits embedded in prompts
- Realistic conversation flow
- Emoji usage and casual tone

## 📝 License

This project is for educational purposes as part of nFactorial course homework. 