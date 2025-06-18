import React, { useRef, useEffect } from 'react';
import { ChatbotHeader } from './ChatbotHeader.tsx';
import { ChatbotMessage } from './ChatbotMessage.tsx';
import { ChatbotInput } from './ChatbotInput.tsx';
import { SuggestedQuestions } from './SuggestedQuestions.tsx';
import type { ChatMessage } from '../types';
import './ChatbotInterface.css';

interface ChatbotInterfaceProps {
  messages: ChatMessage[];
  inputMessage: string;
  suggestedQuestions: string[];
  isTyping: boolean;
  hospitalName: string;
  hospitalLogo?: string;
  welcomeMessage: string;
  onSendMessage: (message: string) => void;
  onInputChange: (message: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClose: () => void;
}

/**
 * ChatbotInterface Component
 * 
 * @description Main chat interface component
 */
export const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({
  messages,
  inputMessage,
  suggestedQuestions,
  isTyping,
  hospitalName,
  hospitalLogo,
  welcomeMessage,
  onSendMessage,
  onInputChange,
  onKeyPress,
  onClose
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added or typing starts
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Scroll immediately for new messages
    scrollToBottom();
  }, [messages, isTyping]);

  // Additional scroll when typing indicator appears
  useEffect(() => {
    if (isTyping && chatMessagesRef.current) {
      const scrollToBottom = () => {
        chatMessagesRef.current?.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: 'smooth'
        });
      };
      
      // Small delay to ensure typing indicator is rendered
      const timeoutId = setTimeout(scrollToBottom, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isTyping]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
    }
  };

  return (
    <div className="chat-popup">
      {/* Chat Header */}
      <ChatbotHeader
        hospitalName={hospitalName}
        hospitalLogo={hospitalLogo}
        onClose={onClose}
      />

      {/* Chat Messages */}
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div className="welcome-text">
              <h4>Xin chào! 👋</h4>
              <p>{welcomeMessage}</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatbotMessage
            key={message.id}
            message={message}
          />
        ))}
        
        {isTyping && (
          <div className="message bot-message typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && !isTyping && (
        <SuggestedQuestions
          questions={suggestedQuestions}
          onQuestionClick={onSendMessage}
        />
      )}

      {/* Chat Input */}
      <ChatbotInput
        value={inputMessage}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        onSend={handleSend}
        disabled={false}
      />
    </div>
  );
}; 