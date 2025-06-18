// ✅ Pages
export { ChatbotWidget } from './pages/index.ts';

// ✅ Components
export { 
  ChatbotInterface, 
  ChatbotMessage, 
  ChatbotInput,
  ChatbotHeader,
  SuggestedQuestions 
} from './components/index.ts';

// ✅ Hooks
export { useChatbot } from './hooks/index.ts';

// ✅ Types
export type { 
  ChatMessage, 
  ChatbotConfig, 
  ChatbotState,
  MessageType,
  Intent,
  ChatResponse 
} from './types/index.ts';

// ✅ Utils
export { ChatbotEngine } from './utils/index.ts'; 