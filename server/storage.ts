import { IStorage } from "./storage";
import createMemoryStore from "memorystore";
import session from "express-session";
import type { Project, ProgressStep, InsertUser, User } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private progress: Map<number, ProgressStep>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.progress = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create default admin
    this.createUser({
      username: "cybersecurite@archibati.fr",
      password: "ahmedadmin3553040#",
      isAdmin: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, isAdmin: insertUser.isAdmin || false };
    this.users.set(id, user);
    return user;
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    const id = this.currentId++;
    const newProject = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async getProjectByClientAndCode(
    clientName: string,
    secretCode: string
  ): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(
      (p) =>
        p.clientName.toLowerCase() === clientName.toLowerCase() &&
        p.secretCode === secretCode
    );
  }

  async getProjectProgress(projectId: number): Promise<ProgressStep[]> {
    return Array.from(this.progress.values()).filter(
      (p) => p.projectId === projectId
    );
  }

  async addProjectProgress(
    progress: Omit<ProgressStep, "id" | "createdAt">
  ): Promise<ProgressStep> {
    const id = this.currentId++;
    const newProgress = {
      ...progress,
      id,
      createdAt: new Date(),
    };
    this.progress.set(id, newProgress);
    return newProgress;
  }

  async updateProgressStatus(
    id: number,
    completed: boolean
  ): Promise<ProgressStep | undefined> {
    const progress = this.progress.get(id);
    if (!progress) return undefined;
    const updated = { ...progress, completed };
    this.progress.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
