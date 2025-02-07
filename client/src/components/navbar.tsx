import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <img src="/logo.png" alt="ARCHI BATI" className="h-8" />
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/track">
              <Button variant="link">Suivi de Projet</Button>
            </Link>
            <a
              href="https://archibati.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link">Visiter le Site Web</Button>
            </a>
          </div>
        </div>

        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/admin">
                  <DropdownMenuItem>Tableau de Bord</DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  className="text-red-500"
                >
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button>Connexion</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}