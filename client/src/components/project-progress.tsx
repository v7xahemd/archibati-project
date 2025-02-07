import { useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgressSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProjectProgress({
  project,
  progress,
  isAdmin = false,
}: {
  project: any;
  progress: any[];
  isAdmin?: boolean;
}) {
  const { toast } = useToast();

  const addProgressMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const res = await apiRequest(
        "POST",
        `/api/projects/${project.id}/progress`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Étape ajoutée avec succès" });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: number;
      completed: boolean;
    }) => {
      const res = await apiRequest("PATCH", `/api/progress/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "État de l'étape mis à jour" });
    },
  });

  const deleteProgressMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/progress/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Étape supprimée avec succès" });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projet de {project.clientName}</h2>
          <p className="text-muted-foreground">Suivi de l'avancement du chantier</p>
        </div>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une Étape
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une Étape</DialogTitle>
              </DialogHeader>
              <NewProgressForm onSubmit={(data) => addProgressMutation.mutate(data)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {progress?.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center cursor-pointer",
                step.completed
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-primary"
              )}
              onClick={() =>
                isAdmin &&
                updateProgressMutation.mutate({
                  id: step.id,
                  completed: !step.completed,
                })
              }
            >
              {step.completed ? (
                <Check className="h-6 w-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(step.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteProgressMutation.mutate(step.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {(!progress || progress.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune étape n'a encore été ajoutée à ce projet.
          </div>
        )}
      </div>
    </div>
  );
}

function NewProgressForm({ onSubmit }: { onSubmit: (data: unknown) => void }) {
  const form = useForm({
    resolver: zodResolver(insertProgressSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Titre de l'étape" {...form.register("title")} />
        <Input placeholder="Description détaillée" {...form.register("description")} />
        <Button type="submit" className="w-full">
          Ajouter l'Étape
        </Button>
      </form>
    </Form>
  );
}