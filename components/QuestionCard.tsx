
import React, { useState } from 'react';
import { Question, QuestionType } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const getTypeColor = (type: QuestionType) => {
    switch (type) {
      case QuestionType.MCQ: return 'bg-blue-100 text-blue-700';
      case QuestionType.SHORT: return 'bg-green-100 text-green-700';
      case QuestionType.LONG: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getTypeColor(question.type)}`}>
            {question.type}
          </span>
          <span className="text-slate-400 font-medium text-sm">Question #{index + 1}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{question.question}</h3>
        
        {question.type === QuestionType.MCQ && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center p-3 border border-slate-100 rounded-lg bg-slate-50 text-sm text-slate-600">
                <span className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded-full mr-3 text-xs font-bold text-slate-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col space-y-3 no-print">
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800 transition-colors w-max"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer & Explanation'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform transition-transform ${showAnswer ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAnswer && (
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg animate-fade-in">
              <p className="font-bold text-indigo-900 text-sm mb-1 uppercase tracking-wider">Correct Answer:</p>
              <p className="text-indigo-800 mb-3">{question.answer}</p>
              {question.explanation && (
                <>
                  <p className="font-bold text-indigo-900 text-sm mb-1 uppercase tracking-wider">Explanation:</p>
                  <p className="text-indigo-700 text-sm italic leading-relaxed">{question.explanation}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Print-only section */}
        <div className="hidden print:block mt-6 pt-4 border-t border-dashed border-slate-200">
          <p className="font-bold text-sm">Answer:</p>
          <p className="text-slate-700 text-sm mb-2">{question.answer}</p>
          <p className="font-bold text-sm">Explanation:</p>
          <p className="text-slate-600 text-xs italic">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
};
