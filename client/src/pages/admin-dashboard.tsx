import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, insertUserSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProjectProgress from "@/components/project-progress";
import { Loader2, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Projet créé avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de la création du projet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Administrateur créé avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Échec de la création de l'administrateur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="projects" className="space-y-8">
        <TabsList>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="admins">Administrateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Projets</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Projet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un Nouveau Projet</DialogTitle>
                </DialogHeader>
                <NewProjectForm onSubmit={(data) => createProjectMutation.mutate(data)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project: any) => (
              <Card
                key={project.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => setSelectedProject(project.id)}
              >
                <CardHeader>
                  <CardTitle>{project.clientName}</CardTitle>
                  <CardDescription>Code secret: {project.secretCode}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admins">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des Administrateurs</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Nouvel Administrateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un Nouvel Administrateur</DialogTitle>
                </DialogHeader>
                <NewAdminForm onSubmit={(data) => createAdminMutation.mutate(data)} />
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>

      {selectedProject && (
        <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Progression du Projet</DialogTitle>
            </DialogHeader>
            <ProjectProgress
              project={projects.find((p: any) => p.id === selectedProject)}
              progress={[]}
              isAdmin
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function NewProjectForm({ onSubmit }: { onSubmit: (data: unknown) => void }) {
  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      clientName: "",
      secretCode: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Nom du Client" {...form.register("clientName")} />
        <Input placeholder="Code Secret" {...form.register("secretCode")} />
        <Button type="submit" className="w-full">
          Créer le Projet
        </Button>
      </form>
    </Form>
  );
}

function NewAdminForm({ onSubmit }: { onSubmit: (data: unknown) => void }) {
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      isAdmin: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Nom d'utilisateur" {...form.register("username")} />
        <Input 
          type="password" 
          placeholder="Mot de passe" 
          {...form.register("password")} 
        />
        <Button type="submit" className="w-full">
          Créer l'Administrateur
        </Button>
      </form>
    </Form>
  );
}