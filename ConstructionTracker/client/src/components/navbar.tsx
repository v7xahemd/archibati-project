import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <img src="/logo.png" alt="ARCHI BATI" className="h-8" />
          </Link>

          {/* Menu burger pour mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation sur desktop */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="/track">
                <Button variant="ghost" className="w-full justify-start">
                  Suivi de Projet
                </Button>
              </Link>
              <a
                href="https://archibati.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="ghost" className="w-full justify-start">
                  Visiter le Site Web
                </Button>
              </a>
              {user ? (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start">
                      Tableau de Bord
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500"
                    onClick={() => logoutMutation.mutate()}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" className="w-full justify-start">
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bouton utilisateur sur mobile */}
        <div className="md:hidden">
          {user ? (
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
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