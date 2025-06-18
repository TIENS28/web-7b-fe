/**
 * Chatbot Types
 * 
 * @description Type definitions for chatbot functionality
 */

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: number;
  intent?: string;
}

export interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
  confidence: number;
  entities?: string[];
}

export interface ChatResponse {
  text: string;
  confidence: number;
  intent: string;
  entities?: Record<string, string>;
  suggestedQuestions?: string[];
}

export interface ChatbotConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  hospitalName?: string;
  hospitalLogo?: string;
  welcomeMessage?: string;
  autoOpen?: boolean;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  inputMessage: string;
  suggestedQuestions: string[];
  isTyping: boolean;
  config: ChatbotConfig;
}

export type MessageType = 'text' | 'image' | 'file' | 'quick_reply'; 