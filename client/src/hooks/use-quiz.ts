import { useState, useEffect } from 'react';
import { useQuery, UseQueryResult, QueryFunction } from '@tanstack/react-query';

export type QuizQuestion = {
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
  questions: QuizQuestion[];
}

export function useQuiz(category?: string) {
  const [shuffled, setShuffled] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    startTime: null,
    endTime: null,
    isCompleted: false,
    sessionId: null,
    questions: [],
  });

  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const queryFn: QueryFunction<QuizQuestion[]> = async () => {
    if (!category || category === 'All') {
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
  };

  const queryResult: UseQueryResult<QuizQuestion[], Error> = useQuery({
    queryKey: ['questions', category],
    queryFn,
  });

  useEffect(() => {
    if (queryResult.data) {
      const prepared = shuffled ? shuffleArray(queryResult.data) : queryResult.data;
      setQuizState((prev) => ({
        ...prev,
        questions: prepared,
        selectedAnswers: new Array(prepared.length).fill(null),
      }));
    }
  }, [queryResult.data, shuffled]);

  const startQuiz = () => {
    const startTime = new Date();
    setQuizState((prev) => ({
      ...prev,
      startTime,
      currentQuestionIndex: 0,
    }));
  };

  const selectAnswer = (answerIndex: number) => {
    setQuizState((prev) => {
      const updated = [...prev.selectedAnswers];
      updated[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, selectedAnswers: updated };
    });
  };

  const nextQuestion = () => {
    setQuizState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= prev.questions.length) return completeQuiz(prev);
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  };

  const previousQuestion = () => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
    }));
  };

  const completeQuiz = (state: QuizState): QuizState => {
    const endTime = new Date();
    const score = calculateScore(state.selectedAnswers, state.questions);
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
    let resetQuestions = queryResult.data ?? [];
    if (shuffled) resetQuestions = shuffleArray(resetQuestions);
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: new Array(resetQuestions.length).fill(null),
      score: 0,
      startTime: null,
      endTime: null,
      isCompleted: false,
      sessionId: null,
      questions: resetQuestions,
    });
  };

  const submitQuiz = () => {
    setQuizState((prev) => completeQuiz(prev));
  };

  const toggleShuffle = () => setShuffled((prev) => !prev);

  const shuffleChoices = () => {
    const updated = [...quizState.questions];
    updated.forEach((q) => {
      q.choices = shuffleArray(q.choices);
    });
    setQuizState((prev) => ({ ...prev, questions: updated }));
  };

  return {
    quizState,
    questions: quizState.questions,
    isLoading: queryResult.isLoading,
    currentQuestion: quizState.questions[quizState.currentQuestionIndex] || null,
    progress:
      quizState.questions.length === 0
        ? 0
        : Math.round((quizState.currentQuestionIndex / quizState.questions.length) * 100),
    selectedAnswer: quizState.selectedAnswers[quizState.currentQuestionIndex] ?? null,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    submitQuiz,
    canGoPrevious: quizState.currentQuestionIndex > 0,
    canGoNext: quizState.selectedAnswers[quizState.currentQuestionIndex] !== null,
    isLastQuestion: quizState.currentQuestionIndex === quizState.questions.length - 1,
    shuffleChoices,
    toggleShuffle,
    shuffled,
  };
}
