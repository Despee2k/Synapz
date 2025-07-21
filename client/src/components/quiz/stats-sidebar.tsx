import { useEffect, useState } from 'react';

interface StatsSidebarProps {
  startTime: Date | null;
  questionsRemaining: number;
  currentStreak?: number;
  category: string;
  progress: number;
}

export function StatsSidebar({ 
  startTime, 
  questionsRemaining, 
  currentStreak = 0,
  category,
  progress 
}: StatsSidebarProps) {
  const [timeElapsed, setTimeElapsed] = useState('00:00');

  useEffect(() => {
    if (!startTime) return;

    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <aside className="fixed right-4 top-24 w-64 bg-white rounded-xl shadow-sm border border-slate-200 p-4 hidden lg:block">
      <h3 className="font-semibold text-slate-800 mb-3">Quiz Statistics</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm">Time Elapsed</span>
          <span className="font-medium text-slate-800">{timeElapsed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm">Questions Left</span>
          <span className="font-medium text-slate-800">{questionsRemaining}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm">Current Streak</span>
          <span className="font-medium text-green-600">{currentStreak}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 mb-2">Category Progress</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-600">{category}</span>
            <div className="w-16 bg-slate-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
