import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { QuizQuestion, QuizSession } from '@shared/schema';

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  sessionId: number | null;
}

export function useQuiz(category?: string) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    startTime: null,
    endTime: null,
    isCompleted: false,
    sessionId: null,
  });

  const { data: questions = [], isLoading } = useQuery<QuizQuestion[]>({
    queryKey: category && category !== 'All' 
      ? ['/api/questions', category] 
      : ['/api/questions'],
    queryFn: async () => {
      const url = category && category !== 'All' 
        ? `/api/questions/${encodeURIComponent(category)}`
        : '/api/questions';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      return response.json();
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest('POST', '/api/sessions', sessionData);
      return response.json();
    },
    onSuccess: (session: QuizSession) => {
      setQuizState(prev => ({ ...prev, sessionId: session.id }));
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PATCH', `/api/sessions/${id}`, data);
      return response.json();
    },
  });

  const startQuiz = () => {
    const startTime = new Date();
    setQuizState(prev => ({
      ...prev,
      startTime,
      selectedAnswers: new Array(questions.length).fill(null),
    }));

    // Create quiz session
    createSessionMutation.mutate({
      startTime: startTime.toISOString(),
      totalQuestions: questions.length,
      userAnswers: [],
      isCompleted: false,
    });
  };

  const selectAnswer = (answerIndex: number) => {
    setQuizState(prev => {
      const newAnswers = [...prev.selectedAnswers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, selectedAnswers: newAnswers };
    });
  };

  const nextQuestion = () => {
    setQuizState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        return completeQuiz(prev);
      }
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  };

  const previousQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }));
  };

  const completeQuiz = (currentState: QuizState) => {
    const endTime = new Date();
    const score = calculateScore(currentState.selectedAnswers, questions);
    
    const completedState = {
      ...currentState,
      endTime,
      score,
      isCompleted: true,
    };

    // Update session
    if (currentState.sessionId) {
      updateSessionMutation.mutate({
        id: currentState.sessionId,
        data: {
          endTime: endTime.toISOString(),
          score,
          isCompleted: true,
          userAnswers: currentState.selectedAnswers.filter(answer => answer !== null),
        },
      });
    }

    return completedState;
  };

  const calculateScore = (answers: (number | null)[], questions: QuizQuestion[]) => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && questions[index] && answer === questions[index].answer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: [],
      score: 0,
      startTime: null,
      endTime: null,
      isCompleted: false,
      sessionId: null,
    });
  };

  const getCurrentQuestion = () => {
    return questions[quizState.currentQuestionIndex] || null;
  };

  const getProgress = () => {
    if (questions.length === 0) return 0;
    return Math.round((quizState.currentQuestionIndex / questions.length) * 100);
  };

  const getSelectedAnswer = () => {
    return quizState.selectedAnswers[quizState.currentQuestionIndex] || null;
  };

  return {
    quizState,
    questions,
    isLoading,
    currentQuestion: getCurrentQuestion(),
    progress: getProgress(),
    selectedAnswer: getSelectedAnswer(),
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    canGoPrevious: quizState.currentQuestionIndex > 0,
    canGoNext: quizState.selectedAnswers[quizState.currentQuestionIndex] !== null,
    isLastQuestion: quizState.currentQuestionIndex === questions.length - 1,
  };
}
