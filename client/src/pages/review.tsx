import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Home, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { QuizQuestion } from '@shared/schema';

interface ReviewProps {
  questions: QuizQuestion[];
  userAnswers: (number | null)[];
  score: number;
  onRetake: () => void;
  onHome: () => void;
}

export function ReviewAnswers({ questions, userAnswers, score, onRetake, onHome }: ReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentQuestion = questions[currentIndex];
  const userAnswer = userAnswers[currentIndex];
  const isCorrect = userAnswer === currentQuestion?.answer;

  const nextQuestion = () => {
    setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  const previousQuestion = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-slate-600">No questions to review</p>
            <Button onClick={onHome} className="mt-4">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">Review Answers</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
              </span>
              <Button variant="outline" onClick={onHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                isCorrect 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 leading-relaxed mb-4">
                {currentQuestion.question}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
                <span>Category: {currentQuestion.category}</span>
                <span>Type: {currentQuestion.type.replace('-', '/')}</span>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => {
                const isUserAnswer = userAnswer === index;
                const isCorrectAnswer = currentQuestion.answer === index;
                
                let bgClass = 'bg-slate-50 border-slate-200';
                let textClass = 'text-slate-700';
                
                if (isCorrectAnswer) {
                  bgClass = 'bg-green-100 border-green-300';
                  textClass = 'text-green-800';
                } else if (isUserAnswer && !isCorrectAnswer) {
                  bgClass = 'bg-red-100 border-red-300';
                  textClass = 'text-red-800';
                }

                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg ${bgClass}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                      <span className={`text-lg ${textClass}`}>
                        {choice}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      {isCorrectAnswer && (
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Correct Answer
                        </span>
                      )}
                      {isUserAnswer && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isCorrectAnswer 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          Your Answer
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={previousQuestion}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={onRetake}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={onHome}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <Button 
            variant="outline" 
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function Review() {
  const [, setLocation] = useLocation();

  // This component should receive props from the quiz completion
  // For now, redirect to home if accessed directly
  const goHome = () => setLocation('/');
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-slate-600 mb-4">No quiz results to review</p>
          <Button onClick={goHome}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}