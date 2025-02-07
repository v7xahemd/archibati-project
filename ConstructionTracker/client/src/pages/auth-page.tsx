import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();

  if (user) {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Bienvenue sur ARCHI BATI</h1>
            <p className="text-muted-foreground">
              Connectez-vous pour gérer les projets de construction et suivre l'avancement des chantiers.
            </p>
          </div>
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:block">
          <div className="relative h-full rounded-lg bg-zinc-900 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/0 rounded-lg" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-4">
                Gestion de Chantiers
              </h2>
              <ul className="space-y-4 text-white/80">
                <li>Suivez l'avancement des travaux en temps réel</li>
                <li>Gérez efficacement plusieurs projets</li>
                <li>Tenez les clients informés avec des rapports d'avancement</li>
                <li>Accès sécurisé pour les administrateurs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
        className="space-y-4"
      >
        <Input
          placeholder="Email"
          {...form.register("username")}
          disabled={loginMutation.isPending}
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          {...form.register("password")}
          disabled={loginMutation.isPending}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Se connecter
        </Button>
      </form>
    </Form>
  );
}