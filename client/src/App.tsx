import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import AdminDashboard from "@/pages/admin-dashboard";
import ClientTracking from "@/pages/client-tracking";
import Navbar from "@/components/navbar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/track" component={ClientTracking} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/admin" component={AdminDashboard} />
        <Route path="/">
          <ClientTracking />
        </Route>
        <Route component={NotFound} />
      </Switch>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Developed by SHALAN Ahmed
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
