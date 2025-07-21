import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Play, BookOpen } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: serverCategories = [], isLoading } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/quiz-data/categories.json');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  const categories = ['All', ...serverCategories];

  const startQuiz = () => {
    const params = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
    setLocation(`/quiz${params}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <Brain className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Synapz</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 text-blue-600 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to Synapz</h2>
          <p className="text-xl text-slate-600 mb-2">Test your knowledge with interactive quizzes</p>
          <p className="text-slate-500">Choose a category and start learning today</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Quiz Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading categories..." : "Choose a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={startQuiz} size="lg" className="w-full" disabled={isLoading}>
                <Play className="w-4 h-4 mr-2" />
                {isLoading ? 'Loading...' : 'Start Quiz'}
              </Button>

              <div className="text-center text-sm text-slate-500">
                {selectedCategory === 'All' 
                  ? 'Questions from all categories will be included'
                  : `Questions will focus on ${selectedCategory}`
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-blue-500 mb-2">
                <Brain className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Interactive Learning</h3>
              <p className="text-sm text-slate-600">Engage with questions designed to test and improve your knowledge</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-green-500 mb-2">
                <Play className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Track Progress</h3>
              <p className="text-sm text-slate-600">Monitor your performance and see detailed results after each quiz</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-purple-500 mb-2">
                <BookOpen className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Review Answers</h3>
              <p className="text-sm text-slate-600">Learn from mistakes by reviewing correct and incorrect answers</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}