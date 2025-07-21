import { QuizQuestion, QuizSession, type InsertQuizQuestion, type InsertQuizSession } from "@shared/schema";

export interface IStorage {
  // Quiz Questions
  getAllQuestions(): Promise<QuizQuestion[]>;
  getQuestionsByCategory(category: string): Promise<QuizQuestion[]>;
  
  // Quiz Sessions
  createSession(session: InsertQuizSession): Promise<QuizSession>;
  updateSession(id: number, session: Partial<QuizSession>): Promise<QuizSession>;
  getSession(id: number): Promise<QuizSession | undefined>;
}

export class MemStorage implements IStorage {
  private questions: Map<number, QuizQuestion>;
  private sessions: Map<number, QuizSession>;
  private currentQuestionId: number;
  private currentSessionId: number;

  constructor() {
    this.questions = new Map();
    this.sessions = new Map();
    this.currentQuestionId = 1;
    this.currentSessionId = 1;
    
    // Initialize with sample data
    this.initializeQuestions();
  }

  private initializeQuestions() {
    const sampleQuestions: QuizQuestion[] = [
      {
        id: 1,
        question: "Substantive due process focuses on fair procedures in legal sanctions",
        choices: ["True", "False"],
        answer: 1,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 2,
        question: "Which amendment protects freedom of speech?",
        choices: ["First Amendment", "Second Amendment", "Third Amendment", "Fourth Amendment"],
        answer: 0,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 3,
        question: "The Bill of Rights consists of the first 10 amendments to the Constitution",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 4,
        question: "Which branch of government has the power to declare war?",
        choices: ["Executive", "Legislative", "Judicial", "All branches equally"],
        answer: 1,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 5,
        question: "The Constitution was written in 1787",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 6,
        question: "How many senators does each state have?",
        choices: ["1", "2", "3", "Depends on population"],
        answer: 1,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 7,
        question: "The president can serve unlimited terms",
        choices: ["True", "False"],
        answer: 1,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 8,
        question: "Which amendment gave women the right to vote?",
        choices: ["15th Amendment", "17th Amendment", "19th Amendment", "21st Amendment"],
        answer: 2,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 9,
        question: "The Supreme Court has 9 justices",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 10,
        question: "Which article of the Constitution establishes the executive branch?",
        choices: ["Article I", "Article II", "Article III", "Article IV"],
        answer: 1,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 11,
        question: "The Constitution can never be changed",
        choices: ["True", "False"],
        answer: 1,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 12,
        question: "How many branches of government are there?",
        choices: ["2", "3", "4", "5"],
        answer: 1,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 13,
        question: "The Electoral College directly elects the president",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Constitution"
      },
      {
        id: 14,
        question: "Which amendment protects against unreasonable searches?",
        choices: ["Second Amendment", "Third Amendment", "Fourth Amendment", "Fifth Amendment"],
        answer: 2,
        type: "multiple-choice",
        category: "Constitution"
      },
      {
        id: 15,
        question: "Congress meets in the Capitol building",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Constitution"
      }
    ];

    sampleQuestions.forEach(question => {
      this.questions.set(question.id, question);
      if (question.id >= this.currentQuestionId) {
        this.currentQuestionId = question.id + 1;
      }
    });
  }

  async getAllQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByCategory(category: string): Promise<QuizQuestion[]> {
    return Array.from(this.questions.values()).filter(
      question => question.category === category
    );
  }

  async createSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = this.currentSessionId++;
    const session: QuizSession = { ...insertSession, id };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: number, sessionUpdate: Partial<QuizSession>): Promise<QuizSession> {
    const existingSession = this.sessions.get(id);
    if (!existingSession) {
      throw new Error(`Session with id ${id} not found`);
    }
    
    const updatedSession = { ...existingSession, ...sessionUpdate };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getSession(id: number): Promise<QuizSession | undefined> {
    return this.sessions.get(id);
  }
}

export const storage = new MemStorage();
