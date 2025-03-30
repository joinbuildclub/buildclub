import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section className="relative pt-32 pb-24 overflow-hidden bg-white bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight font-heading">
            Where <span className="bg-gradient-to-r from-primary to-[#7928CA] text-transparent bg-clip-text">AI builders</span> meet IRL
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            A community of product managers, designers, and engineers collaborating to build meaningful AI solutions in real life.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button 
              onClick={() => handleNavigation('#join')} 
              size="lg" 
              className="bg-[#370B73] hover:bg-[#370B73]/90 text-white font-medium px-10 py-6 rounded-lg text-lg h-auto"
            >
              Join the club <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => handleNavigation('#events')} 
              variant="outline"
              size="lg" 
              className="border-gray-300 hover:border-primary hover:bg-white text-gray-800 font-medium px-10 py-6 rounded-lg text-lg h-auto"
            >
              Explore events
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-gray-200 pt-16">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">350+</p>
            <p className="text-gray-600 mt-2">Community members</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">45+</p>
            <p className="text-gray-600 mt-2">Meetups hosted</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">28</p>
            <p className="text-gray-600 mt-2">Projects launched</p>
          </div>
        </div>
      </div>
    </section>
  );
}
