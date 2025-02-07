import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { clientLoginSchema, type ClientLogin } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProjectProgress from "@/components/project-progress";
import { Loader2 } from "lucide-react";

export default function ClientTracking() {
  const [trackingData, setTrackingData] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<ClientLogin>({
    resolver: zodResolver(clientLoginSchema),
    defaultValues: {
      clientName: "",
      secretCode: "",
    },
  });

  const trackMutation = useMutation({
    mutationFn: async (data: ClientLogin) => {
      const res = await apiRequest("POST", "/api/track", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setTrackingData(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Track Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => trackMutation.mutate(data))}
              className="space-y-4"
            >
              <Input
                placeholder="Client Name"
                {...form.register("clientName")}
                disabled={trackMutation.isPending}
              />
              <Input
                placeholder="Secret Code"
                type="password"
                {...form.register("secretCode")}
                disabled={trackMutation.isPending}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={trackMutation.isPending}
              >
                {trackMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                View Progress
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {trackingData && (
        <div className="mt-8">
          <ProjectProgress
            project={trackingData.project}
            progress={trackingData.progress}
          />
        </div>
      )}
    </div>
  );
}
