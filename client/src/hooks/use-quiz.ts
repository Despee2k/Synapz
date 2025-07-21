import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type QuizQuestion = {
  id: number;
  question: string;
  choices: string[];
  answer: number;
  type: 'true-false' | 'multiple-choice';
  category: string;
};

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  sessionId: null;
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
    queryKey: ['questions', category],
    queryFn: async () => {
      if (!category || category === 'All') {
        // Fetch all categories from categories.json
        const res = await fetch('/quiz-data/categories.json');
        if (!res.ok) throw new Error('Failed to load category list');
        const categoryList: string[] = await res.json();

        const allQuestions: QuizQuestion[] = [];

        for (const file of categoryList) {
          try {
            const qRes = await fetch(`/quiz-data/${file}.json`);
            if (qRes.ok) {
              const data: QuizQuestion[] = await qRes.json();
              allQuestions.push(...data);
            }
          } catch (err) {
            console.error(`Failed to load ${file}.json`, err);
          }
        }

        return allQuestions;
      } else {
        const res = await fetch(`/quiz-data/${category}.json`);
        if (!res.ok) throw new Error('Failed to load questions');
        return res.json();
      }
    },
  });

  const startQuiz = () => {
    const startTime = new Date();
    setQuizState(prev => ({
      ...prev,
      startTime,
      selectedAnswers: new Array(questions.length).fill(null),
    }));
  };

  const selectAnswer = (answerIndex: number) => {
    setQuizState(prev => {
      const updated = [...prev.selectedAnswers];
      updated[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, selectedAnswers: updated };
    });
  };

  const nextQuestion = () => {
    setQuizState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= questions.length) return completeQuiz(prev);
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  };

  const previousQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }));
  };

  const completeQuiz = (state: QuizState): QuizState => {
    const endTime = new Date();
    const score: number = calculateScore(state.selectedAnswers, questions);
    return {
      ...state,
      endTime,
      score,
      isCompleted: true,
    };
  };

  const calculateScore = (answers: (number | null)[], questions: QuizQuestion[]) => {
    return answers.reduce((acc: number, answer, i) => {
      if (answer !== null && answer === questions[i]?.answer) {
        return acc + 1;
      }
      return acc;
    }, 0);
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

  return {
    quizState,
    questions,
    isLoading,
    currentQuestion: questions[quizState.currentQuestionIndex] || null,
    progress:
      questions.length === 0
        ? 0
        : Math.round((quizState.currentQuestionIndex / questions.length) * 100),
    selectedAnswer: quizState.selectedAnswers[quizState.currentQuestionIndex] ?? null,
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
