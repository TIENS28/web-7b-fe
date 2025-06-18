import React from 'react';
import type { ChatMessage } from '../types';

interface ChatbotMessageProps {
  message: ChatMessage;
}

export const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message }) => {
  // Function to render text with clickable links
  const renderMessageText = (text: string) => {
    // Split text by newlines and process each line
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check if line contains a link pattern like "/services" or "/services?tab=pricing"
      const linkMatch = line.match(/(\/[^\s]+)/g);
      
      if (linkMatch) {
        const parts = line.split(/(\/[^\s]+)/g);
        return (
          <div key={lineIndex} className="message-line">
            {parts.map((part, partIndex) => {
              if (linkMatch.includes(part)) {
                return (
                  <a
                    key={partIndex}
                    href={part}
                    className="message-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Mở ${part} trong tab mới`}
                  >
                    {part}
                  </a>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      }
      
      return <div key={lineIndex} className="message-line">{line}</div>;
    });
  };

  return (
    <div className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {renderMessageText(message.text)}
      </div>
      <div className="message-time">
        {message.timestamp.toLocaleTimeString('vi-VN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
}; 