import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  currentQuestion: number;
  totalQuestions: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationControls({
  currentQuestion,
  totalQuestions,
  canGoPrevious,
  canGoNext,
  isLastQuestion,
  onPrevious,
  onNext,
}: NavigationControlsProps) {
  const renderDots = () => {
    const dots = [];
    const maxDotsToShow = 7;
    
    if (totalQuestions <= maxDotsToShow) {
      // Show all dots if total is small
      for (let i = 0; i < totalQuestions; i++) {
        dots.push(
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i <= currentQuestion ? 'bg-blue-500' : 
              i === currentQuestion + 1 ? 'bg-blue-300' : 'bg-slate-300'
            }`}
          />
        );
      }
    } else {
      // Show condensed view for longer quizzes
      for (let i = 0; i < Math.min(5, currentQuestion + 1); i++) {
        dots.push(
          <div key={i} className="w-2 h-2 bg-blue-500 rounded-full" />
        );
      }
      
      if (currentQuestion < totalQuestions - 3) {
        dots.push(<span key="ellipsis" className="text-slate-400 mx-2">...</span>);
      }
      
      const remainingDots = Math.max(0, totalQuestions - currentQuestion - 1);
      for (let i = 0; i < Math.min(2, remainingDots); i++) {
        dots.push(
          <div key={`remaining-${i}`} className="w-2 h-2 bg-slate-300 rounded-full" />
        );
      }
    }
    
    return dots;
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <button 
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="flex items-center space-x-2 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium">Previous</span>
      </button>

      <div className="flex items-center space-x-3">
        <div className="flex space-x-2">
          {renderDots()}
        </div>
      </div>

      <button 
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isLastQuestion ? 'Finish Quiz' : 'Next'}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
