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
    
    // Check if we're on the homepage and trying to scroll to a section
    if (window.location.pathname === "/" && href.startsWith("#")) {
      // Remove the slash from "/#section" to get just "#section"
      const sectionId = href.replace(/\//g, "");
      
      // Use the correct selector for ID
      const element = document.querySelector(sectionId);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
        return;
      }
    }
    
    // If not on homepage or section not found, navigate to the href
    window.location.href = href.startsWith("/") ? href : `/${href}`;
  };

  return (
    <nav className="fixed w-full bg-white z-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="focus:outline-none">
              <img
                src={logoPath}
                alt="BuildClub Logo"
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button
                onClick={() => handleNavigation("/#about")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation("/#explore")}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Explore
              </button>
              <Link
                href="/events"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Events
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="default" className="gap-2">
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
                    onClick={() => handleNavigation("/#about")}
                    className="text-left px-2 py-2 text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors"
                  >
                    About
                  </button>
                  <button
                    onClick={() => handleNavigation("/#explore")}
                    className="text-left px-2 py-2 text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors"
                  >
                    Explore
                  </button>
                  <Link
                    href="/events"
                    className="text-left px-2 py-2 text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors block"
                  >
                    Events
                  </Link>
                  {isAuthenticated ? (
                    <Link href="/dashboard">
                      <Button variant="default" className="gap-2 w-full">
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
