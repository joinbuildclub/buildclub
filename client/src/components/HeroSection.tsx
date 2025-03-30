import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer, Puzzle, Users } from "lucide-react";
import {
  RoundedTriangle,
  RoundedSquare,
  RoundedCircle,
} from "@/components/shapes";
import logoPath from "../assets/logo.png";

export default function HeroSection() {
  const handleNavigation = (href: string) => {
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
    <section className="relative pt-12 sm:pt-64 pb-32 overflow-hidden bg-white">
      <RoundedTriangle
        className="sm:left-20 sm:top-1/4"
        width="w-16 sm:w-56"
        height="h-16 sm:h-56"
        rotate="rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedCircle
        className="top-20 right-2 sm:right-16 sm:top-1/4"
        width="w-12 sm:w-48"
        height="h-12 sm:h-48"
        animateClass="animate-floating-delayed"
        shadow
      />

      <RoundedSquare
        className="top-80 sm:left-1/3 sm:top-10"
        width="w-12 sm:w-48"
        height="h-12 sm:h-48"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex w-full justify-center items-center py-8">
          <img
            src={logoPath}
            alt="BuildClub Logo"
            className="hidden sm:block h-24 w-auto"
          />
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-gray-800">
            Where <span className="text-[var(--color-red)]">AI</span> builders
            meet <span className="text-[var(--color-blue)]">IRL</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-12">
            A fun community of product makers, designers, and engineers
            collaborating to build meaningful AI solutions in real life.
          </p>
          <div className="flex w-full justify-center">
            <div className="flex flex-col max-w-xs items-center w-full justify-center">
              <Button
                onClick={() => handleNavigation("#join")}
                size="lg"
                className="clay-button bg-[var(--color-green)] text-white font-bold px-10 py-6 text-lg sm:text-2xl h-auto border-0 transition-all duration-500 hover:bg-[var(--color-red)]/90"
              >
                Join the club
              </Button>
              <Button
                variant="link"
                onClick={() => handleNavigation("#events")}
                size="lg"
                className="text-gray-700 font-medium text-xl mt-4"
              >
                View upcoming events
              </Button>
            </div>
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
