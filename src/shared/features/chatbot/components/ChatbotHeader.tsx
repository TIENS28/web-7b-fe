import React from 'react';

interface ChatbotHeaderProps {
  hospitalName: string;
  hospitalLogo?: string;
  onClose: () => void;
}

export const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({
  hospitalName,
  hospitalLogo,
  onClose
}) => {
  return (
    <div className="chat-header">
      <div className="chat-title">
        <div className="chat-avatar">
          {hospitalLogo ? (
            <img src={hospitalLogo} alt={hospitalName} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          )}
        </div>
        <div className="chat-info">
          <h3>{hospitalName}</h3>
          <span className="status">Online</span>
        </div>
      </div>
      <button 
        className="close-button"
        onClick={onClose}
        aria-label="Đóng chatbot"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  );
}; 