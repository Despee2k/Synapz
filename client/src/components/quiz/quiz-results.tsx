import { Trophy, RotateCcw, Eye } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetake: () => void;
  onReview?: () => void;
}

export function QuizResults({ score, totalQuestions, onRetake, onReview }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - score;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center animate-slide-in">
      <div className="mb-6">
        <div className="bg-green-100 text-green-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-600">Great job on finishing the Constitution quiz</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {score}/{totalQuestions}
        </div>
        <div className="text-lg text-slate-700 mb-1">Your Score</div>
        <div className="text-3xl font-semibold text-green-600">{percentage}%</div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-sm text-slate-600">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{incorrectAnswers}</div>
          <div className="text-sm text-slate-600">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700">{totalQuestions}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onRetake}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
        {onReview && (
          <button 
            onClick={onReview}
            className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 rounded-lg transition-all font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>Review Answers</span>
          </button>
        )}
      </div>
    </div>
  );
}
