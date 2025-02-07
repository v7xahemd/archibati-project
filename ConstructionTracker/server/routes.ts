import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProjectSchema, insertProgressSchema, clientLoginSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Client routes
  app.post("/api/track", async (req, res) => {
    const result = clientLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Données invalides" });
    }

    const project = await storage.getProjectByClientAndCode(
      result.data.clientName,
      result.data.secretCode
    );

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    const progress = await storage.getProjectProgress(project.id);
    res.json({ project, progress });
  });

  // Admin routes
  app.get("/api/projects", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }
    const projects = await storage.getAllProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const result = insertProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Données invalides" });
    }

    const project = await storage.createProject(result.data);
    res.status(201).json(project);
  });

  app.post("/api/projects/:id/progress", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const progressData = {
      ...req.body,
      projectId: parseInt(req.params.id),
      completed: false,
    };

    const result = insertProgressSchema.omit({ id: true, createdAt: true }).safeParse(progressData);

    if (!result.success) {
      return res.status(400).json({ error: "Données invalides" });
    }

    const progress = await storage.addProjectProgress(result.data);
    res.status(201).json(progress);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    await storage.deleteProject(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.patch("/api/progress/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const result = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      completed: z.boolean().optional(),
    }).safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: "Données invalides" });
    }

    const progress = await storage.updateProgress(
      parseInt(req.params.id),
      result.data
    );
    res.json(progress);
  });

  app.delete("/api/progress/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    await storage.deleteProgress(parseInt(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}