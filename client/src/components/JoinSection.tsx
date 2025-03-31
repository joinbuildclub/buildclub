import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import RoundedCircle from "@/components/shapes/RoundedCircle";

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

          <div className="bg-white p-10 border border-gray-200 rounded-3xl">
            <div className="text-center py-8">
              <p className="text-gray-700 mb-10 text-lg">
                Join BuildClub and become part of our community of AI builders.
                After signing up, you'll be able to share more about yourself and your interests.
              </p>
              
              <a href="/auth/google" className="inline-block">
                <Button
                  className="clay-button flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-lg py-6 px-8"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                  </svg>
                  Sign in with Google
                </Button>
              </a>
              
              <p className="text-sm text-gray-500 mt-8">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
