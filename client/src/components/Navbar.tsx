import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  
  const handleNavigation = (href: string) => {
    setOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-sans font-bold text-2xl text-foreground">Build<span className="text-primary">Club</span></span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button onClick={() => handleNavigation('#about')} className="text-foreground hover:text-primary text-sm font-medium transition-colors">
                About
              </button>
              <button onClick={() => handleNavigation('#roles')} className="text-foreground hover:text-primary text-sm font-medium transition-colors">
                Roles
              </button>
              <button onClick={() => handleNavigation('#events')} className="text-foreground hover:text-primary text-sm font-medium transition-colors">
                Events
              </button>
              <Button onClick={() => handleNavigation('#join')} className="bg-primary hover:bg-primary/90 text-white rounded-full">
                Join Waitlist
              </Button>
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
                    onClick={() => handleNavigation('#about')} 
                    className="text-left px-2 py-2 text-foreground hover:text-primary text-lg font-medium transition-colors"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => handleNavigation('#roles')} 
                    className="text-left px-2 py-2 text-foreground hover:text-primary text-lg font-medium transition-colors"
                  >
                    Roles
                  </button>
                  <button 
                    onClick={() => handleNavigation('#events')} 
                    className="text-left px-2 py-2 text-foreground hover:text-primary text-lg font-medium transition-colors"
                  >
                    Events
                  </button>
                  <Button 
                    onClick={() => handleNavigation('#join')} 
                    className="bg-primary hover:bg-primary/90 text-white rounded-full w-full"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
