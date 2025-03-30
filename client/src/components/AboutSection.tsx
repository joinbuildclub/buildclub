import { Users, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

function FeatureCard({ icon, title, description, iconBgColor, iconColor }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-2">
      <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-6", iconBgColor)}>
        <div className={cn("w-7 h-7", iconColor)}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-primary/5 to-[#EC4899]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6">What is <span className="bg-gradient-to-r from-primary to-[#EC4899] text-transparent bg-clip-text">BuildClub</span>?</h2>
          <p className="text-lg text-muted-foreground">We're a community of builders focused on bringing AI innovations from concepts to reality through collaboration and hands-on creation.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Users className="w-full h-full" />}
            title="Real-Life Community"
            description="Moving beyond virtual spaces, we focus on in-person collaboration, networking, and building together in shared physical environments."
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
          
          <FeatureCard 
            icon={<Zap className="w-full h-full" />}
            title="Cross-Disciplinary"
            description="Bringing together product managers, designers, engineers, and AI specialists to create comprehensive solutions from multiple perspectives."
            iconBgColor="bg-[#EC4899]/10"
            iconColor="text-[#EC4899]"
          />
          
          <FeatureCard 
            icon={<Cpu className="w-full h-full" />}
            title="Build-Focused"
            description="We prioritize creating tangible AI products and tools rather than just discussing concepts, with a strong emphasis on practical implementations."
            iconBgColor="bg-[#10B981]/10"
            iconColor="text-[#10B981]"
          />
        </div>
      </div>
    </section>
  );
}
