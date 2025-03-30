import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, Puzzle, Users } from "lucide-react";

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
    <section className="relative pt-24 pb-32 overflow-hidden bg-white">
      {/* Clay-like decorative shapes - mapped to roles */}
      {/* Red Triangle (Product) */}
      <div className="absolute -left-20 top-1/4 w-40 h-40 rotate-12 animate-floating overflow-hidden" 
           style={{ 
             filter: 'url(#round-triangle)',
             boxShadow: '0 10px 0 0 rgba(0,0,0,0.1)'
           }}>
           <svg width="0" height="0" className="absolute">
             <defs>
               <filter id="round-triangle">
                 <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                 <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9" result="roundTriangle" />
                 <feComposite in="SourceGraphic" in2="roundTriangle" operator="atop" />
               </filter>
             </defs>
           </svg>
           <div 
             className="w-full h-full bg-[var(--color-red)]" 
             style={{ clipPath: 'polygon(50% 10%, 15% 90%, 85% 90%)' }}
           ></div>
      </div>
      {/* Blue Circle (Design) */}
      <div className="absolute -right-16 top-1/3 w-32 h-32 bg-[var(--color-blue)] rounded-full animate-floating-delayed" 
           style={{ boxShadow: '0 10px 0 0 rgba(0,0,0,0.1)' }}>
      </div>
      {/* Yellow Square (Engineering) */}
      <div className="absolute left-1/4 bottom-20 w-24 h-24 bg-[var(--color-yellow)] rounded-md -rotate-12 animate-floating" 
           style={{ boxShadow: '0 8px 0 0 rgba(0,0,0,0.1)' }}>
      </div>
      {/* Red Triangle (Product - smaller) */}
      <div className="absolute right-1/3 top-20 w-20 h-20 rotate-0 animate-floating-delayed overflow-hidden" 
           style={{ 
             filter: 'url(#round-triangle-small)',
             boxShadow: '0 8px 0 0 rgba(0,0,0,0.1)'
           }}>
           <svg width="0" height="0" className="absolute">
             <defs>
               <filter id="round-triangle-small">
                 <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                 <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9" result="roundTriangle" />
                 <feComposite in="SourceGraphic" in2="roundTriangle" operator="atop" />
               </filter>
             </defs>
           </svg>
           <div 
             className="w-full h-full bg-[var(--color-red)]" 
             style={{ clipPath: 'polygon(50% 10%, 15% 90%, 85% 90%)' }}
           ></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-gray-800">
            Where <span className="text-[var(--color-red)]">AI</span> builders meet <span className="text-[var(--color-blue)]">IRL</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
            A fun community of product makers, designers, and engineers collaborating to build meaningful AI solutions in real life.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              onClick={() => handleNavigation('#join')} 
              size="lg" 
              className="clay-button bg-[var(--color-red)] text-white font-bold px-10 py-6 text-lg h-auto border-0 transition-all duration-500 hover:bg-[var(--color-red)]/90"
            >
              Join the club <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </Button>
            <Button 
              onClick={() => handleNavigation('#events')} 
              size="lg" 
              className="clay-button bg-[var(--color-blue)] text-white font-bold px-10 py-6 text-lg h-auto border-0 transition-all duration-500 hover:bg-[var(--color-blue)]/90"
            >
              Explore events
            </Button>
          </div>
        </div>
        
        {/* Stats with clay-like cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="clay-card bg-[var(--color-red)] text-white text-center animate-floating group transition-all duration-500 hover:bg-[var(--color-red)]/90 cursor-pointer">
            <div className="rounded-full bg-white/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
              <Users className="h-8 w-8 text-white" />
            </div>
            <p className="text-4xl font-bold">350+</p>
            <p className="mt-2 font-medium">Community members</p>
          </div>
          
          <div className="clay-card bg-[var(--color-yellow)] text-white text-center animate-floating-delayed group transition-all duration-500 hover:bg-[var(--color-yellow)]/90 cursor-pointer">
            <div className="rounded-full bg-white/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
              <Puzzle className="h-8 w-8 text-white" />
            </div>
            <p className="text-4xl font-bold">45+</p>
            <p className="mt-2 font-medium">Meetups hosted</p>
          </div>
          
          <div className="clay-card bg-[var(--color-blue)] text-white text-center animate-floating group transition-all duration-500 hover:bg-[var(--color-blue)]/90 cursor-pointer">
            <div className="rounded-full bg-white/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
              <Hammer className="h-8 w-8 text-white" />
            </div>
            <p className="text-4xl font-bold">28</p>
            <p className="mt-2 font-medium">Projects launched</p>
          </div>
        </div>
      </div>
    </section>
  );
}
