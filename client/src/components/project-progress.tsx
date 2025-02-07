import { useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
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
      toast({ title: "Progress updated" });
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
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{project.clientName}'s Project</h2>
          <p className="text-muted-foreground">Track construction progress</p>
        </div>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Progress Step</DialogTitle>
              </DialogHeader>
              <NewProgressForm onSubmit={(data) => addProgressMutation.mutate(data)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {progress.map((step, index) => (
          <div
            key={step.id}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
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
            <div>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
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
        <Input placeholder="Title" {...form.register("title")} />
        <Input placeholder="Description" {...form.register("description")} />
        <Button type="submit" className="w-full">
          Add Progress
        </Button>
      </form>
    </Form>
  );
}
