import { 
  users, type User, type InsertUser,
  responses, type Response, type InsertResponse,
  type FormSubmission
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  
  // Response operations
  createResponse(response: InsertResponse): Promise<Response>;
  getResponse(id: number): Promise<Response | undefined>;
  getResponseByUserId(userId: number): Promise<Response | undefined>;
  
  // Form submission operations
  getFormSubmission(userId: number): Promise<FormSubmission | undefined>;
  getAllFormSubmissions(): Promise<FormSubmission[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private responses: Map<number, Response>;
  private userIdCounter: number;
  private responseIdCounter: number;

  constructor() {
    this.users = new Map();
    this.responses = new Map();
    this.userIdCounter = 1;
    this.responseIdCounter = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { id, ...insertUser, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createResponse(insertResponse: InsertResponse): Promise<Response> {
    const id = this.responseIdCounter++;
    const completedAt = new Date();
    
    // Create response with explicit null values for optional fields
    const response: Response = { 
      id, 
      userId: insertResponse.userId,
      question1: insertResponse.question1 ?? null,
      question1b: insertResponse.question1b ?? null,
      question2: insertResponse.question2 ?? null,
      question2b: insertResponse.question2b ?? null,
      question3: insertResponse.question3 ?? null,
      question3b: insertResponse.question3b ?? null,
      question4: insertResponse.question4 ?? null,
      question4b: insertResponse.question4b ?? null,
      question5: insertResponse.question5 ?? null,
      question5b: insertResponse.question5b ?? null,
      completedAt
    };
    
    this.responses.set(id, response);
    return response;
  }

  async getResponse(id: number): Promise<Response | undefined> {
    return this.responses.get(id);
  }

  async getResponseByUserId(userId: number): Promise<Response | undefined> {
    return Array.from(this.responses.values()).find(
      (response) => response.userId === userId
    );
  }

  async getFormSubmission(userId: number): Promise<FormSubmission | undefined> {
    const user = await this.getUser(userId);
    const response = await this.getResponseByUserId(userId);
    
    if (!user || !response) return undefined;
    
    // Calculate file name based on user group
    const groupNum = parseInt(user.userGroup);
    const baseImageNum = (groupNum - 1) * 500;
    const fileName = `${baseImageNum}.jpg`;
    
    // Ensure completedAt is a valid Date
    const completedAt = response.completedAt || new Date();
    
    return {
      id: user.id,
      name: user.name,
      userGroup: user.userGroup,
      fileName: fileName,
      question1: response.question1 || undefined,
      question1b: response.question1b || undefined,
      question2: response.question2 || undefined,
      question2b: response.question2b || undefined,
      question3: response.question3 || undefined,
      question3b: response.question3b || undefined,
      question4: response.question4 || undefined,
      question4b: response.question4b || undefined,
      question5: response.question5 || undefined,
      question5b: response.question5b || undefined,
      completedAt,
    };
  }

  async getAllFormSubmissions(): Promise<FormSubmission[]> {
    const submissions: FormSubmission[] = [];
    
    for (const user of this.users.values()) {
      const response = await this.getResponseByUserId(user.id);
      if (response) {
        // Calculate file name based on user group
        const groupNum = parseInt(user.userGroup);
        const baseImageNum = (groupNum - 1) * 500;
        const fileName = `${baseImageNum}.jpg`;
        
        // Ensure completedAt is a valid Date
        const completedAt = response.completedAt || new Date();
        
        submissions.push({
          id: user.id,
          name: user.name,
          userGroup: user.userGroup,
          fileName: fileName,
          question1: response.question1 || undefined,
          question1b: response.question1b || undefined,
          question2: response.question2 || undefined,
          question2b: response.question2b || undefined,
          question3: response.question3 || undefined,
          question3b: response.question3b || undefined,
          question4: response.question4 || undefined,
          question4b: response.question4b || undefined,
          question5: response.question5 || undefined,
          question5b: response.question5b || undefined,
          completedAt,
        });
      }
    }
    
    return submissions;
  }
}

// Export storage instance
export const storage = new MemStorage();
