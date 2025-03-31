import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  RoundedTriangle,
  RoundedSquare,
  RoundedCircle,
} from "@/components/shapes";
import {
  SiOpenai,
  SiAnthropic,
  SiGoogle,
  SiMeta,
  SiAmazon,
  SiHuggingface,
  SiVercel,
  SiReplit,
} from "react-icons/si";
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
        className="md:left-20 sm:top-10 lg:top-1/4"
        width="w-16 sm:w-56"
        height="h-16 sm:h-56"
        rotate="rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedCircle
        className="top-20 right-2 md:right-16 xl:top-1/4"
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

        {/* Logo cloud section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <div className="clay-shape bg-gray-700 px-5 py-2">
                <span className="text-sm sm:text-xl font-bold text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" /> Build with leading AI
                  technologies
                </span>
              </div>
            </div>
          </div>

          <div className="clay-card bg-white border border-gray-200 p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center">
              <div className="flex flex-col items-center justify-center group">
                <SiOpenai className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  OpenAI
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiAnthropic className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  Anthropic
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiGoogle className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  Google
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiMeta className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  Meta
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiAmazon className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  AWS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiHuggingface className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  Hugging Face
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiVercel className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  Vercel
                </span>
              </div>

              <div className="flex flex-col items-center justify-center group">
                <SiReplit className="h-12 w-12 text-gray-500 transition-all duration-300 group-hover:text-gray-700" />
                <span className="mt-2 text-gray-500 font-medium text-sm group-hover:text-gray-700">
                  Replit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
