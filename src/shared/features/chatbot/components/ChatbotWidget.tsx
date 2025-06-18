import React from 'react';
import { useChatbot } from '../hooks';
import { ChatbotInterface } from './ChatbotInterface.tsx';
import type { ChatbotConfig } from '../types';
import './ChatbotWidget.css';

interface ChatbotWidgetProps extends ChatbotConfig {
  className?: string;
}

/**
 * ChatbotWidget Component
 * 
 * @description Main chatbot widget component that can be integrated into any page
 */
export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  position = 'bottom-right',
  theme = 'light',
  hospitalName = 'Bệnh viện 7B',
  hospitalLogo,
  welcomeMessage = 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
  autoOpen = false,
  className = ''
}) => {
  const {
    isOpen,
    messages,
    inputMessage,
    suggestedQuestions,
    isTyping,
    sendMessage,
    toggleChat,
    setInputMessage
  } = useChatbot({
    position,
    theme,
    hospitalName,
    hospitalLogo,
    welcomeMessage,
    autoOpen
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <div className={`chatbot-widget chatbot-${position} chatbot-${theme} ${className}`}>
      {/* Floating Message Icon */}
      <div 
        className={`message-icon ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Mở chatbot"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <ChatbotInterface
          messages={messages}
          inputMessage={inputMessage}
          suggestedQuestions={suggestedQuestions}
          isTyping={isTyping}
          hospitalName={hospitalName}
          hospitalLogo={hospitalLogo}
          welcomeMessage={welcomeMessage}
          onSendMessage={sendMessage}
          onInputChange={setInputMessage}
          onKeyPress={handleKeyPress}
          onClose={toggleChat}
        />
      )}
    </div>
  );
}; 