import React from 'react';
import './SuggestedQuestions.css';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onQuestionClick
}) => {
  return (
    <div className="suggested-questions">
      <div className="suggested-questions-header">
        <span>Gợi ý câu hỏi</span>
      </div>
      <div className="suggested-questions-list">
        {questions.slice(0, 6).map((question, index) => (
          <button
            key={index}
            className="suggested-question"
            onClick={() => onQuestionClick(question)}
            title={question} // Show full text on hover
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}; 