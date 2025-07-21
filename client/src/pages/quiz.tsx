import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuiz } from '@/hooks/use-quiz';
import { QuizHeader } from '@/components/quiz/quiz-header';
import { ProgressIndicator } from '@/components/quiz/progress-indicator';
import { QuestionCard } from '@/components/quiz/question-card';
import { NavigationControls } from '@/components/quiz/navigation-controls';
import { QuizResults } from '@/components/quiz/quiz-results';
import { StatsSidebar } from '@/components/quiz/stats-sidebar';
import { ReviewAnswers } from '@/pages/review';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [showReview, setShowReview] = useState(false);
  
  // Get category from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || undefined;

  const {
    quizState,
    questions,
    isLoading,
    currentQuestion,
    progress,
    selectedAnswer,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    canGoPrevious,
    canGoNext,
    isLastQuestion,
  } = useQuiz(category);

  const goHome = () => setLocation('/');
  
  const handleRetake = () => {
    setShowReview(false);
    resetQuiz();
  };

  const handleReview = () => {
    setShowReview(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <QuizHeader onHome={goHome} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading quiz...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!quizState.startTime) {
    const categoryDisplay = category || 'All Categories';
    return (
      <div className="min-h-screen bg-slate-50">
        <QuizHeader category={categoryDisplay} onHome={goHome} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Play className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Ready to Start?</h2>
                <p className="text-slate-600 mb-4">
                  Test your knowledge with {questions.length} questions {category ? `about ${category}` : 'from all categories'}
                </p>
                <div className="text-sm text-slate-500 mb-6">
                  Take your time and choose the best answer for each question
                </div>
              </div>
              <Button onClick={startQuiz} size="lg" className="px-8">
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (quizState.isCompleted) {
    if (showReview) {
      return (
        <ReviewAnswers
          questions={questions}
          userAnswers={quizState.selectedAnswers}
          score={quizState.score}
          onRetake={handleRetake}
          onHome={goHome}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-50">
        <QuizHeader onHome={goHome} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <QuizResults
            score={quizState.score}
            totalQuestions={questions.length}
            onRetake={handleRetake}
            onReview={handleReview}
            onHome={goHome}
          />
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50">
        <QuizHeader onHome={goHome} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600">No questions available</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <QuizHeader onHome={goHome} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <ProgressIndicator
          currentQuestion={quizState.currentQuestionIndex}
          totalQuestions={questions.length}
          category={currentQuestion.category}
        />

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={selectAnswer}
        />

        <NavigationControls
          currentQuestion={quizState.currentQuestionIndex}
          totalQuestions={questions.length}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          isLastQuestion={isLastQuestion}
          onPrevious={previousQuestion}
          onNext={nextQuestion}
        />
      </main>

      <StatsSidebar
        startTime={quizState.startTime}
        questionsRemaining={questions.length - quizState.currentQuestionIndex - 1}
        currentStreak={0}
        category={currentQuestion.category}
        progress={progress}
      />
    </div>
  );
}
