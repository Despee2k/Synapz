import { Brain, Settings } from 'lucide-react';

interface QuizHeaderProps {
  title?: string;
  category?: string;
}

export function QuizHeader({ title = "QuizMaster", category = "Constitution Quiz" }: QuizHeaderProps) {
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
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
