import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  if (user) {
    return <Redirect to="/admin" />;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Welcome to ARCHI BATI</h1>
            <p className="text-muted-foreground">
              Login to manage construction projects and track client progress.
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden lg:block">
          <div className="relative h-full rounded-lg bg-zinc-900 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/0 rounded-lg" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-4">
                Construction Project Management
              </h2>
              <ul className="space-y-4 text-white/80">
                <li>Track construction progress in real-time</li>
                <li>Manage multiple projects efficiently</li>
                <li>Keep clients updated with progress reports</li>
                <li>Secure access for administrators</li>
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
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
            className="space-y-4"
          >
            <Input
              placeholder="Username"
              {...form.register("username")}
              disabled={loginMutation.isPending}
            />
            <Input
              type="password"
              placeholder="Password"
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
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create new account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
            className="space-y-4"
          >
            <Input
              placeholder="Username"
              {...form.register("username")}
              disabled={registerMutation.isPending}
            />
            <Input
              type="password"
              placeholder="Password"
              {...form.register("password")}
              disabled={registerMutation.isPending}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
