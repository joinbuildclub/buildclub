import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogIn } from "lucide-react";
import logoPath from "../assets/logo.png";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleNavigation = (href: string) => {
    setOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed w-full bg-white z-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => handleNavigation("#")}
              className="focus:outline-none"
            >
              <img
                src={logoPath}
                alt="BuildClub Logo"
                className="h-14 w-auto"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button
                onClick={() => handleNavigation("#about")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation("#roles")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Roles
              </button>
              <button
                onClick={() => handleNavigation("#events")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Events
              </button>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="default" className="gap-2">
                    <User size={16} />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="link" className="gap-2 text-gray-700">
                      <LogIn size={16} />
                      Login
                    </Button>
                  </Link>
                  <Button onClick={() => handleNavigation("#join")}>
                    Join the club
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <div className="flex flex-col gap-6 pt-6">
                  <button
                    onClick={() => handleNavigation("#about")}
                    className="text-left px-2 py-2 text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors"
                  >
                    About
                  </button>
                  <button
                    onClick={() => handleNavigation("#roles")}
                    className="text-left px-2 py-2 text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors"
                  >
                    Roles
                  </button>
                  <button
                    onClick={() => handleNavigation("#events")}
                    className="text-left px-2 py-2 text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors"
                  >
                    Events
                  </button>
                  {isAuthenticated ? (
                    <Link href="/dashboard">
                      <Button variant="default" className="gap-2 w-full">
                        <User size={16} />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/auth" className="w-full">
                        <Button variant="outline" className="gap-2 w-full">
                          <LogIn size={16} />
                          Login
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleNavigation("#join")}
                        className="w-full mt-2"
                      >
                        Join the club
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
