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
  return (
    <div
      className="bg-white rounded-2xl shadow-lg relative group overflow-hidden transform transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
      style={{ 
        transitionDelay: `${delay}ms`
      }}
    >
      <div 
        className={`${color} h-24 w-full flex items-center justify-center relative overflow-hidden`}
        style={{
          borderRadius: '0.75rem 0.75rem 0 0'
        }}
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="bg-white/90 rounded-full p-4 shadow-lg transform -translate-y-1/4">
          <div className="text-gray-800">
            {icon}
          </div>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-50 relative overflow-hidden">
      <RoundedTriangle
        className="left-48 top-10"
        width="w-36"
        height="h-36"
        color="var(--color-red)"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedSquare
        className="right-0 top-48"
        width="w-36"
        height="h-36"
        color="var(--color-yellow)"
        rotate="rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedCircle
        className="bottom-1/4 left-10"
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

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Users className="w-8 h-8 text-gray-800" />}
            title="In-Person Collaboration"
            description="We believe in the creative power of being physically together. Our meetups and hackathons focus on face-to-face collaboration in shared spaces."
            color="bg-[var(--color-red)]"
          />

          <Feature
            icon={<Zap className="w-8 h-8 text-gray-800" />}
            title="Learning by Building"
            description="We learn through hands-on creation rather than just discussion. Our community values experimental prototyping and practical problem-solving."
            color="bg-[var(--color-blue)]"
            delay={100}
          />

          <Feature
            icon={<Cpu className="w-8 h-8 text-gray-800" />}
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
