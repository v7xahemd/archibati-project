import { users, projects, progressSteps, type User, type InsertUser, type Project, type ProgressStep } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
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
  deleteProgress(id: number): Promise<void>;
  deleteProject(id: number): Promise<void>;
  updateProgress(id: number, data: Partial<Omit<ProgressStep, "id" | "createdAt">>): Promise<ProgressStep | undefined>;
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
          password: "ahmedadmin3553040",
          isAdmin: true,
        });
      }
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const rows = await db.select().from(users).where(eq(users.id, id));
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()));
    return rows[0];
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
        clientName: project.clientName.toLowerCase(),
        secretCode: project.secretCode,
      })
      .returning();
    return newProject;
  }

  async getProjectByClientAndCode(
    clientName: string,
    secretCode: string
  ): Promise<Project | undefined> {
    const rows = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.clientName, clientName.toLowerCase()),
          eq(projects.secretCode, secretCode)
        )
      );
    return rows[0];
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

  async deleteProgress(id: number): Promise<void> {
    await db.delete(progressSteps).where(eq(progressSteps.id, id));
  }

  async deleteProject(id: number): Promise<void> {
    // D'abord supprimer toutes les étapes associées au projet
    await db.delete(progressSteps).where(eq(progressSteps.projectId, id));
    // Ensuite supprimer le projet
    await db.delete(projects).where(eq(projects.id, id));
  }

  async updateProgress(
    id: number,
    data: Partial<Omit<ProgressStep, "id" | "createdAt">>
  ): Promise<ProgressStep | undefined> {
    const [progress] = await db
      .update(progressSteps)
      .set(data)
      .where(eq(progressSteps.id, id))
      .returning();
    return progress;
  }
}

export const storage = new DatabaseStorage();