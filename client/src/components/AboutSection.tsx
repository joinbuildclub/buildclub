import { Users, Zap, Cpu } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="mb-5 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">What is <span className="bg-gradient-to-r from-primary to-[#9333EA] text-transparent bg-clip-text">BuildClub</span>?</h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            We're a community of builders focused on bringing AI innovations from concepts to reality through collaboration and hands-on creation in real-life environments.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <Feature 
            icon={<Users className="w-8 h-8" />}
            title="Real-Life Community"
            description="Moving beyond virtual spaces, we focus on in-person collaboration, networking, and building together in shared physical environments."
          />
          
          <Feature 
            icon={<Zap className="w-8 h-8" />}
            title="Cross-Disciplinary"
            description="Bringing together product managers, designers, engineers, and AI specialists to create comprehensive solutions from multiple perspectives."
          />
          
          <Feature 
            icon={<Cpu className="w-8 h-8" />}
            title="Build-Focused"
            description="We prioritize creating tangible AI products and tools rather than just discussing concepts, with a strong emphasis on practical implementations."
          />
        </div>
      </div>
    </section>
  );
}
