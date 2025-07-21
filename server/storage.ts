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
      // Constitution questions
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
      // History questions
      {
        id: 6,
        question: "World War II ended in which year?",
        choices: ["1944", "1945", "1946", "1947"],
        answer: 1,
        type: "multiple-choice",
        category: "History"
      },
      {
        id: 7,
        question: "The American Civil War began in 1861",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "History"
      },
      {
        id: 8,
        question: "Who was the first President of the United States?",
        choices: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
        answer: 1,
        type: "multiple-choice",
        category: "History"
      },
      {
        id: 9,
        question: "The Declaration of Independence was signed in 1776",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "History"
      },
      {
        id: 10,
        question: "Which event started World War I?",
        choices: ["Sinking of the Lusitania", "Assassination of Archduke Franz Ferdinand", "German invasion of Belgium", "Russian Revolution"],
        answer: 1,
        type: "multiple-choice",
        category: "History"
      },
      // Government questions
      {
        id: 11,
        question: "How many senators does each state have?",
        choices: ["1", "2", "3", "Depends on population"],
        answer: 1,
        type: "multiple-choice",
        category: "Government"
      },
      {
        id: 12,
        question: "The president can serve unlimited terms",
        choices: ["True", "False"],
        answer: 1,
        type: "true-false",
        category: "Government"
      },
      {
        id: 13,
        question: "How many branches of government are there?",
        choices: ["2", "3", "4", "5"],
        answer: 1,
        type: "multiple-choice",
        category: "Government"
      },
      {
        id: 14,
        question: "The Electoral College directly elects the president",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Government"
      },
      {
        id: 15,
        question: "Congress meets in the Capitol building",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Government"
      },
      // Law questions
      {
        id: 16,
        question: "What does 'habeas corpus' mean?",
        choices: ["Right to remain silent", "Right to legal counsel", "Right to be brought before a judge", "Right to trial by jury"],
        answer: 2,
        type: "multiple-choice",
        category: "Law"
      },
      {
        id: 17,
        question: "Miranda rights must be read before any police questioning",
        choices: ["True", "False"],
        answer: 1,
        type: "true-false",
        category: "Law"
      },
      {
        id: 18,
        question: "Which court is the highest in the United States?",
        choices: ["Federal Court", "District Court", "Appeals Court", "Supreme Court"],
        answer: 3,
        type: "multiple-choice",
        category: "Law"
      },
      {
        id: 19,
        question: "Double jeopardy means being tried twice for the same crime",
        choices: ["True", "False"],
        answer: 0,
        type: "true-false",
        category: "Law"
      },
      {
        id: 20,
        question: "What is the burden of proof in criminal cases?",
        choices: ["Preponderance of evidence", "Clear and convincing", "Beyond reasonable doubt", "Absolute certainty"],
        answer: 2,
        type: "multiple-choice",
        category: "Law"
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
