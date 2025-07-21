import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    const params =
      selectedCategory !== 'All'
        ? `?category=${encodeURIComponent(selectedCategory)}`
        : '';
    setLocation(`/quiz${params}`);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Brain className="w-8 h-8" />
        Synapz
      </h1>
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Welcome to Synapz</h2>
          <p>Test your knowledge with interactive quizzes</p>
          <p>Choose a category and start learning today</p>
          <div>
            <label className="text-sm font-medium">Select Quiz Category</label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Category" />
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
          <Button className="w-full" onClick={startQuiz}>
            <Play className="mr-2 h-4 w-4" />
            Start Quiz
          </Button>
          <p className="text-sm text-muted-foreground">
            Questions from {selectedCategory === 'All' ? 'all categories' : selectedCategory} will be included
          </p>
        </CardContent>
      </Card>

      <Card className="w-full max-w-xl grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className="flex flex-col items-center text-center">
          <Brain className="w-6 h-6 mb-2" />
          <p className="font-medium">Interactive Learning</p>
          <p className="text-sm">Engage with questions designed to test and improve your knowledge</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Play className="w-6 h-6 mb-2" />
          <p className="font-medium">Track Progress</p>
          <p className="text-sm">Monitor your performance and see detailed results after each quiz</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <BookOpen className="w-6 h-6 mb-2" />
          <p className="font-medium">Review Answers</p>
          <p className="text-sm">Learn from mistakes by reviewing correct and incorrect answers</p>
        </div>
      </Card>
    </div>
  );
}
