import { users, projects, progressSteps, type User, type InsertUser, type Project, type ProgressStep } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { isAdmin?: boolean }): Promise<User>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: Omit<Project, "id">): Promise<Project>;
  getProjectByClientAndCode(clientName: string, secretCode: string): Promise<Project | undefined>;
  getProjectProgress(projectId: number): Promise<ProgressStep[]>;
  addProjectProgress(progress: Omit<ProgressStep, "id" | "createdAt">): Promise<ProgressStep>;
  updateProgressStatus(id: number, completed: boolean): Promise<ProgressStep | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });

    // Create default admin on first run
    this.getUserByUsername("cybersecurite@archibati.fr").then(user => {
      if (!user) {
        this.createUser({
          username: "cybersecurite@archibati.fr",
          password: "ahmedadmin3553040#",
          isAdmin: true,
        });
      }
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()));
    return user;
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        username: insertUser.username.toLowerCase(),
        isAdmin: insertUser.isAdmin || false,
      })
      .returning();
    return user;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({
        ...project,
        clientName: project.clientName.toLowerCase(),
      })
      .returning();
    return newProject;
  }

  async getProjectByClientAndCode(
    clientName: string,
    secretCode: string
  ): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.clientName, clientName.toLowerCase()))
      .where(eq(projects.secretCode, secretCode));
    return project;
  }

  async getProjectProgress(projectId: number): Promise<ProgressStep[]> {
    return await db
      .select()
      .from(progressSteps)
      .where(eq(progressSteps.projectId, projectId));
  }

  async addProjectProgress(
    progress: Omit<ProgressStep, "id" | "createdAt">
  ): Promise<ProgressStep> {
    const [newProgress] = await db
      .insert(progressSteps)
      .values(progress)
      .returning();
    return newProgress;
  }

  async updateProgressStatus(
    id: number,
    completed: boolean
  ): Promise<ProgressStep | undefined> {
    const [progress] = await db
      .update(progressSteps)
      .set({ completed })
      .where(eq(progressSteps.id, id))
      .returning();
    return progress;
  }
}

export const storage = new DatabaseStorage();