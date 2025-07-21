import { QuizQuestion, QuizSession, type InsertQuizQuestion, type InsertQuizSession } from "@shared/schema";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface IStorage {
  // Quiz Questions
  getAllQuestions(): Promise<QuizQuestion[]>;
  getQuestionsByCategory(category: string): Promise<QuizQuestion[]>;
  getAvailableCategories(): string[];
  
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
    
    // Load questions from JSON files
    this.loadQuestionsFromFiles();
  }

  private loadQuestionsFromFiles() {
    const quizDataDir = path.join(__dirname, 'quiz-data');
    let questionId = 1;

    try {
      // Get all JSON files in the quiz-data directory
      const files = fs.readdirSync(quizDataDir).filter(file => file.endsWith('.json'));
      
      files.forEach(file => {
        const filePath = path.join(quizDataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const questions: QuizQuestion[] = JSON.parse(fileContent);
        
        // Assign sequential IDs and store questions
        questions.forEach(question => {
          const questionWithId = { ...question, id: questionId++ };
          this.questions.set(questionWithId.id, questionWithId);
        });
      });

      this.currentQuestionId = questionId;
      console.log(`Loaded ${this.questions.size} questions from ${files.length} categories`);
      
      // Log the actual categories found in the data
      const actualCategories = this.getAvailableCategories();
      console.log('Available categories:', actualCategories);
    } catch (error) {
      console.error('Error loading quiz data from files:', error);
      // Fallback to empty questions map
      this.questions = new Map();
    }
  }

  // Method to get available categories
  getAvailableCategories(): string[] {
    const categories = new Set<string>();
    this.questions.forEach(question => {
      categories.add(question.category);
    });
    return Array.from(categories).sort();
  }

  async getAllQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.questions.values());
  }

  async getQuestionsByCategory(category: string): Promise<QuizQuestion[]> {
    // Create a mapping between URL-encoded category names and actual category names
    const categoryMappings: { [key: string]: string } = {
      'Freedom-of-Religion': 'Freedom of Religion',
      'Criminal-Law': 'Criminal Law',
      'Family-Code': 'Family Code',
      'Freedom-of-Speech-Expression': 'Freedom of Speech / Expression',
      'National-Territory': 'National Territory',
      'Search-and-Seizures': 'Philippine Law on Searches and Seizures'
    };

    // Use the mapping if it exists, otherwise use the category as-is
    const actualCategory = categoryMappings[category] || category;
    
    const filteredQuestions = Array.from(this.questions.values()).filter(
      question => question.category === actualCategory
    );
    
    console.log(`Filtering for category: "${category}" -> "${actualCategory}", found ${filteredQuestions.length} questions`);
    return filteredQuestions;
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
