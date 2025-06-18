import { useState, useEffect } from 'react';
import { ChatbotEngine } from '../utils';
import type { ChatMessage, ChatbotConfig, ChatbotState } from '../types';

/**
 * Custom hook for chatbot functionality
 */
export const useChatbot = (config: ChatbotConfig = {}) => {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    messages: [],
    inputMessage: '',
    suggestedQuestions: [],
    isTyping: false,
    config: {
      position: 'bottom-right',
      theme: 'light',
      hospitalName: 'Bệnh viện 7B',
      autoOpen: false,
      ...config
    }
  });

  const chatbotEngine = new ChatbotEngine();

  useEffect(() => {
    // Load initial suggested questions
    const initialQuestions = chatbotEngine.getSuggestedQuestionsForIntent('greeting');
    setState(prev => ({
      ...prev,
      suggestedQuestions: initialQuestions
    }));
  }, []);

  const sendMessage = async (message: string) => {
    console.log('sendMessage called with:', message);
    if (!message.trim()) {
      console.log('Message is empty, returning');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    console.log('Adding user message:', userMessage);

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      inputMessage: '',
      isTyping: true
    }));

    // Simulate typing delay
    setTimeout(() => {
      console.log('Processing bot response for:', message);
      const response = chatbotEngine.processMessage(message);
      console.log('Bot response:', response);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        confidence: response.confidence,
        intent: response.intent
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
        suggestedQuestions: response.suggestedQuestions || prev.suggestedQuestions
      }));
    }, 1000);
  };

  const toggleChat = () => {
    console.log('toggleChat called');
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  const setInputMessage = (message: string) => {
    console.log('setInputMessage called with:', message);
    setState(prev => {
      console.log('Previous state:', prev.inputMessage);
      const newState = {
        ...prev,
        inputMessage: message
      };
      console.log('New state:', newState.inputMessage);
      return newState;
    });
  };

  const clearMessages = () => {
    setState(prev => ({
      ...prev,
      messages: []
    }));
  };

  return {
    ...state,
    sendMessage,
    toggleChat,
    setInputMessage,
    clearMessages
  };
}; 