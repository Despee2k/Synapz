import { HelpCircle, Tag, List } from 'lucide-react';

type QuizQuestion = {
  id: number;
  question: string;
  choices: string[];
  answer: number;
  type: 'true-false' | 'multiple-choice';
  category: string;
};

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6 animate-slide-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-50 text-blue-600 rounded-full p-3 flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-800 leading-relaxed mb-4">
              {question.question}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{question.category}</span>
              </span>
              <span className="flex items-center space-x-1">
                <List className="w-4 h-4" />
                <span className="capitalize">
                  {question.type.replace('-', '/')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        {question.choices.map((choice, index) => {
          const isSelected = selectedAnswer === index;
          const inputId = `choice-${question.id}-${index}`;

          return (
            <label
              key={index}
              htmlFor={inputId}
              className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {/* Hidden Input */}
              <input
                id={inputId}
                name={`question-${question.id}`}
                type="radio"
                value={index}
                checked={isSelected}
                onChange={() => onSelectAnswer(index)}
                className="sr-only"
              />

              <div className="flex items-center space-x-4 w-full">
                {/* Radio circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-blue-500' : 'border-slate-300 group-hover:border-blue-500'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-blue-500 transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>

                {/* Answer Text */}
                <span
                  className={`text-lg transition-colors ${
                    isSelected
                      ? 'text-slate-900 font-medium'
                      : 'text-slate-700 group-hover:text-slate-900'
                  }`}
                >
                  {choice}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
