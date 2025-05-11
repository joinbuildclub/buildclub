import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import { Link } from "wouter";

export default function JoinSection() {
  return (
    <section id="join" className="py-24 bg-white relative overflow-hidden">
      <div>
        <RoundedTriangle
          className="top-4 sm:top-0 sm:left-24"
          width="w-24 sm:w-48"
          height="h-24 sm:h-48"
          rotate="-rotate-12"
          animateClass="animate-floating"
          shadow
        />

        <RoundedSquare
          className="right-0 top-8 xl:top-48"
          width="w-24 md:w-48"
          height="h-24 md:h-48"
          rotate="rotate-12"
          animateClass="animate-floating-delayed"
          shadow
        />

        <RoundedCircle
          className="top-48 sm:top-16 sm:bottom-1/4 sm:-left-24"
          width="w-16 sm:w-36"
          height="h-16 sm:h-36"
          animateClass="animate-floating-delayed"
          shadow
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-block mb-6">
              <div className="clay-shape bg-gray-700 px-5 py-2">
                <span className="text-xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" /> Join Us
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Join the{" "}
              <span className="text-[var(--color-red)]">BuildClub</span>{" "}
              Community
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Be part of our fun crew of builders creating cool AI stuff
              together! Sign up for our upcoming events.
            </p>
          </div>

          <div className="text-center">
            <Link to="/auth" className="inline-block">
              <Button className="clay-button bg-[var(--color-green)] text-white hover:bg-[var(--color-green)]/90 font-bold text-xl sm:text-3xl py-8 px-12 sm:py-12 sm:px-24 shadow-lg transition-all duration-200 border-0 hover:scale-[0.995] hover:shadow-md">
                Join the club
              </Button>
            </Link>

            <p className="text-sm text-gray-500 mt-8">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
