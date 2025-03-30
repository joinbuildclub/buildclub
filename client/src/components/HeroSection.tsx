import { Button } from "@/components/ui/button";
import AnimatedBlob from "./AnimatedBlob";
import FloatingCard from "./FloatingCard";
import { Sparkles, Calendar } from "lucide-react";

export default function HeroSection() {
  const handleNavigation = (href: string) => {
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
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background decorative elements */}
      <AnimatedBlob className="top-20 right-0 w-64 h-64 -z-10" color="primary" />
      <AnimatedBlob className="bottom-10 left-0 w-80 h-80 -z-10" color="secondary" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 leading-tight">
              Building the future <span className="bg-gradient-to-r from-primary to-[#EC4899] text-transparent bg-clip-text">together with AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              A community bringing together curious minds to collaborate, 
              innovate, and build meaningful AI solutions in real life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => handleNavigation('#join')} 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                Join the waitlist
              </Button>
              <Button 
                onClick={() => handleNavigation('#events')} 
                variant="outline"
                size="lg" 
                className="border-border hover:border-primary/50 hover:bg-primary/5 text-foreground font-medium px-8 py-3 rounded-full"
              >
                Upcoming events
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div>
                <p className="font-sans text-3xl font-bold text-primary">350+</p>
                <p className="text-sm text-muted-foreground">Community members</p>
              </div>
              <div>
                <p className="font-sans text-3xl font-bold text-primary">45+</p>
                <p className="text-sm text-muted-foreground">Meetups hosted</p>
              </div>
              <div>
                <p className="font-sans text-3xl font-bold text-primary">28</p>
                <p className="text-sm text-muted-foreground">Projects launched</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80" 
                alt="BuildClub community members collaborating" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-[#EC4899]/40 mix-blend-overlay"></div>
            </div>
            
            {/* Floating elements */}
            <FloatingCard 
              className="absolute -bottom-8 -left-8"
              icon={<Sparkles className="w-full h-full" />}
              title="Latest Project"
              subtitle="AI Collaboration Tool"
              iconBgColor="bg-[#10B981]/20"
              iconColor="text-[#10B981]"
            />
            
            <FloatingCard 
              className="absolute -top-6 -right-6"
              icon={<Calendar className="w-full h-full" />}
              title="Next Meetup"
              subtitle="Jun 15, San Francisco"
              iconBgColor="bg-[#EC4899]/20"
              iconColor="text-[#EC4899]"
              delay={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
