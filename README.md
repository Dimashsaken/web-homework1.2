# Telegram Clone - Messenger with AI Integration

A modern web messenger application inspired by Telegram, featuring real-time chat with human contacts and AI assistant integration.

## 🚀 Features

- **Modern Telegram-like UI** with clean, responsive design
- **AI Chat Integration** with OpenAI GPT-3.5-turbo
- **Real-time messaging** simulation
- **Persistent chat history** using localStorage
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Feature-Sliced Design** architecture

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

   **Note:** If you don't have an OpenAI API key, the app will work with mock AI responses.

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📱 Usage

1. **Chat Selection**: Click on any chat from the left sidebar
2. **Send Messages**: Type your message and click "Send" or press Enter
3. **AI Chat**: Select "AI Assistant" to chat with the AI
4. **Persistent Storage**: All your chats are saved locally

## 🏗 Architecture

The project follows Feature-Sliced Design methodology:

```
src/
├── app/           # Application layer (main App component)
├── shared/        # Shared utilities, types, and services
│   ├── types/     # TypeScript interfaces
│   └── lib/       # Utilities (storage, OpenAI service)
```

## 🎨 Design System

- **Primary Color**: Telegram Blue (#0088cc)
- **Typography**: Inter font family
- **Layout**: Responsive design with mobile support
- **Components**: Reusable, typed React components

## 🤖 AI Integration

The app integrates with OpenAI's GPT-3.5-turbo model:
- Real API calls when API key is provided
- Mock responses for demo purposes
- Typing indicators during AI responses
- Error handling for API failures

## 📦 Dependencies

- **React 18+** - Modern React with hooks
- **TypeScript** - Type safety
- **React Router DOM** - Navigation
- **React Hook Form** - Form handling
- **Tailwind CSS** - Utility-first styling

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 📝 License

This project is for educational purposes as part of nFactorial course homework. 