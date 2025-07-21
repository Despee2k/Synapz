import { Brain, Home } from 'lucide-react';

interface QuizHeaderProps {
  title?: string;
  category?: string;
  onHome?: () => void;
}

export function QuizHeader({ title = "Synapz", category = "Constitution Quiz", onHome }: QuizHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">{category}</span>
            {onHome && (
              <button 
                onClick={onHome}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
