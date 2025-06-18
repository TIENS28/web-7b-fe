import React from 'react';
import './ChatbotInput.css';

interface ChatbotInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const ChatbotInput: React.FC<ChatbotInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.value);
    onChange(e.target.value);
  };

  const handleSend = () => {
    console.log('Send button clicked, value:', value);
    onSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', e.key);
    onKeyPress(e);
  };

  return (
    <div className="chat-input">
      {/* Test input để debug */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Nhập tin nhắn..."
        className="message-input"
        disabled={false}
        style={{
          position: 'relative',
          zIndex: 1002,
          pointerEvents: 'auto'
        }}
      />
      <button 
        onClick={handleSend}
        className="send-button"
        disabled={!value.trim()}
        aria-label="Gửi tin nhắn"
        style={{
          position: 'relative',
          zIndex: 1002,
          pointerEvents: 'auto'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  );
}; 