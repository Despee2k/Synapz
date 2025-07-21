interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  category: string;
}

export function ProgressIndicator({ currentQuestion, totalQuestions, category }: ProgressIndicatorProps) {
  const progress = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-slate-500 text-sm">{category}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600">Progress</div>
          <div className="text-lg font-semibold text-slate-800">{progress}%</div>
        </div>
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
