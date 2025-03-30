import { Users, Zap, Cpu, Sparkles } from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import RoundedSquare from "@/components/shapes/RoundedSquare";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

function Feature({ icon, title, description, color, delay = 0 }: FeatureProps) {
  const colorClass = color === 'bg-[var(--color-red)]' ? 'from-red-500 to-red-600' : 
                     color === 'bg-[var(--color-blue)]' ? 'from-blue-500 to-blue-600' : 
                     'from-yellow-400 to-yellow-500';
  
  return (
    <div
      className="relative group transition-all duration-500 flex flex-col h-full"
      style={{ 
        transitionDelay: `${delay}ms`
      }}
    >
      {/* Clay-like shape in the background */}
      <div className="absolute w-full h-full bg-white rounded-[2.5rem] rotate-3 top-3 left-2 opacity-70"></div>
      
      {/* Main content container */}
      <div className="relative z-10 bg-white p-8 pt-12 rounded-[2rem] flex flex-col h-full border border-gray-100 shadow-xl transform group-hover:-rotate-1 group-hover:translate-x-1 transition-all duration-500">
        {/* Floating icon */}
        <div className={`absolute -top-10 left-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-3 transition-all duration-500`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <div className="mt-12 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
          <p className="text-gray-600 flex-grow">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-red-200"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-blue-200"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-yellow-200"></div>
      </div>
      
      <RoundedTriangle
        className="left-48 top-10 z-10"
        width="w-36"
        height="h-36"
        color="var(--color-red)"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedSquare
        className="right-0 top-48 z-10"
        width="w-36"
        height="h-36"
        color="var(--color-yellow)"
        rotate="rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedCircle
        className="bottom-1/4 left-10 z-10"
        width="w-24"
        height="h-24"
        color="var(--color-blue)"
        animateClass="animate-floating-delayed"
        shadow
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 text-center">
          <div className="inline-block mb-6">
            <div className="clay-shape bg-gray-700 px-5 py-2">
              <span className="text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> About Us
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            What is <span className="text-[var(--color-red)]">BuildClub</span>?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're a playful community of builders making AI come to life through
            hands-on collaboration and experimentation in real-world environments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          <Feature
            icon={<Users className="w-10 h-10 text-white" />}
            title="In-Person Collaboration"
            description="We believe in the creative power of being physically together. Our meetups and hackathons focus on face-to-face collaboration in shared spaces."
            color="bg-[var(--color-red)]"
          />

          <Feature
            icon={<Zap className="w-10 h-10 text-white" />}
            title="Learning by Building"
            description="We learn through hands-on creation rather than just discussion. Our community values experimental prototyping and practical problem-solving."
            color="bg-[var(--color-blue)]"
            delay={100}
          />

          <Feature
            icon={<Cpu className="w-10 h-10 text-white" />}
            title="Diverse Perspectives"
            description="Our strength comes from our mix of backgrounds. We bring together product thinkers, designers, and engineers to create more thoughtful AI solutions."
            color="bg-[var(--color-yellow)]"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}
