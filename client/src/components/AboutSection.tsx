import { Users, Zap, Cpu, Sparkles } from "lucide-react";

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
      className={`clay-card ${color} text-white transform transition-all duration-500 hover:-translate-y-2 hover:${color.replace('bg-', 'bg-')}/90 group cursor-pointer`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="rounded-full bg-white/20 w-16 h-16 mb-6 flex items-center justify-center transition-all duration-500 group-hover:bg-white/30">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Clay-like decorative shapes */}
      <div className="absolute -right-16 -bottom-10 w-36 h-36 bg-[var(--color-blue)] rounded-full" style={{ boxShadow: '0 10px 0 0 rgba(0,0,0,0.1)' }}></div>
      <div className="absolute left-10 top-20 w-24 h-24 bg-[var(--color-yellow)] rounded-md rotate-12" style={{ boxShadow: '0 8px 0 0 rgba(0,0,0,0.1)' }}></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 text-center">
          <div className="inline-block mb-6">
            <div className="clay-shape bg-[var(--color-yellow)] px-5 py-2">
              <span className="text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> About Us
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">What is <span className="text-[var(--color-red)]">BuildClub</span>?</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're a playful community of builders making AI come to life through collaboration and hands-on creation in real-world environments.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Feature 
            icon={<Users className="w-8 h-8 text-white" />}
            title="Real-Life Community"
            description="Moving beyond virtual spaces, we focus on in-person collaboration, building together in shared physical environments."
            color="bg-[var(--color-red)]"
          />
          
          <Feature 
            icon={<Zap className="w-8 h-8 text-white" />}
            title="Cross-Disciplinary"
            description="Bringing together product managers, designers, engineers, and AI specialists to create solutions from multiple perspectives."
            color="bg-[var(--color-blue)]"
            delay={100}
          />
          
          <Feature 
            icon={<Cpu className="w-8 h-8 text-white" />}
            title="Build-Focused"
            description="We prioritize creating tangible AI products rather than just talking about them. We build stuff that works!"
            color="bg-[var(--color-yellow)]"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}
