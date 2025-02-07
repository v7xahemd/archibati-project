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
import { insertProjectSchema, insertProgressSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProjectProgress from "@/components/project-progress";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
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
              <CardDescription>Code: {project.secretCode}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Project Progress</DialogTitle>
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
        <Input placeholder="Client Name" {...form.register("clientName")} />
        <Input placeholder="Secret Code" {...form.register("secretCode")} />
        <Button type="submit" className="w-full">
          Create Project
        </Button>
      </form>
    </Form>
  );
}
