import { Check, Users, Lightbulb, Code, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleFeatureProps {
  children: React.ReactNode;
  color: string;
}

function RoleFeature({ children, color }: RoleFeatureProps) {
  return (
    <li className="flex items-start mb-4">
      <div className={`rounded-full ${color} p-1 mr-3 flex-shrink-0`} style={{ boxShadow: '0 3px 0 0 rgba(0,0,0,0.1)' }}>
        <Check className="h-4 w-4 text-white" />
      </div>
      <span className="text-gray-700">{children}</span>
    </li>
  );
}

interface RoleSectionProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  color: string;
  bgColor: string;
  index: number;
}

function RoleSection({ 
  title, 
  icon,
  description, 
  features, 
  color,
  bgColor,
  index
}: RoleSectionProps) {
  return (
    <div className={`clay-card ${bgColor} p-8 mb-12 relative overflow-hidden transition-all duration-500 hover:${bgColor.replace('bg-', 'bg-')}/95 group cursor-pointer`}>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className={`inline-flex items-center ${color} rounded-full px-4 py-2 mb-4 clay-shape transition-all duration-500 group-hover:${color.replace('bg-', 'bg-')}/80`}>
            {icon}
            <span className="ml-2 font-bold text-white">{title}</span>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">{title} Role</h3>
          <p className="text-white/90 mb-6 leading-relaxed">{description}</p>
          
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full opacity-30 transition-all duration-700 group-hover:bg-white/20"></div>
          {index % 2 === 0 && (
            <div className="absolute top-10 -right-6 w-24 h-24 bg-white/10 rounded-full opacity-20 transition-all duration-700 group-hover:bg-white/20"></div>
          )}
          {index % 2 === 1 && (
            <div className="absolute -bottom-8 left-1/3 w-28 h-28 bg-white/10 rounded-3xl rotate-12 opacity-20 transition-all duration-700 group-hover:bg-white/20"></div>
          )}
        </div>
        
        <div>
          <div className="bg-white/10 rounded-2xl p-5 transition-all duration-500 group-hover:bg-white/20">
            <ul>
              {features.map((feature, idx) => (
                <RoleFeature key={idx} color={color}>
                  {feature}
                </RoleFeature>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RolesSection() {
  return (
    <section id="roles" className="py-24 bg-white relative overflow-hidden">
      {/* Clay-like decorative shapes */}
      <div className="absolute -left-16 top-32 w-32 h-32 bg-[var(--color-green)] rounded-3xl rotate-12" style={{ boxShadow: '0 10px 0 0 rgba(0,0,0,0.1)' }}></div>
      <div className="absolute right-10 bottom-20 w-20 h-20 bg-[var(--color-yellow)] rounded-full" style={{ boxShadow: '0 7px 0 0 rgba(0,0,0,0.1)' }}></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 text-center">
          <div className="inline-block mb-6">
            <div className="clay-shape bg-[var(--color-yellow)] px-5 py-2">
              <span className="text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> The Crew
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Who builds at <span className="text-[var(--color-red)]">BuildClub</span>?</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our diverse community brings together different skills and perspectives to create awesome AI solutions.
          </p>
        </div>
        
        <div>
          <RoleSection 
            title="Product"
            icon={<Users className="h-5 w-5 text-white" />}
            description="Product leaders who translate AI capabilities into user-centered experiences. They bridge technical possibilities with market needs to create things people love."
            features={[
              "Define AI-enhanced product roadmaps",
              "Balance technical innovation with user needs",
              "Create ethical AI product strategies"
            ]}
            color="bg-[var(--color-red)]"
            bgColor="bg-[var(--color-red)]"
            index={0}
          />
          
          <RoleSection 
            title="Design"
            icon={<Lightbulb className="h-5 w-5 text-white" />}
            description="Experience designers crafting intuitive interfaces for AI tools. They humanize complex AI interactions, making technology accessible and fun to use!"
            features={[
              "Create intuitive AI interaction patterns",
              "Design for transparency and trust",
              "Visualize complex AI concepts for users"
            ]}
            color="bg-[var(--color-green)]"
            bgColor="bg-[var(--color-green)]"
            index={1}
          />
          
          <RoleSection 
            title="Engineering"
            icon={<Code className="h-5 w-5 text-white" />}
            description="Technical builders bringing AI innovations to life. They architect AI-powered applications and make the magic happen behind the scenes."
            features={[
              "Develop scalable AI infrastructure",
              "Integrate AI models into applications",
              "Build AI tools with responsible practices"
            ]}
            color="bg-[var(--color-blue)]"
            bgColor="bg-[var(--color-blue)]"
            index={2}
          />
        </div>
      </div>
    </section>
  );
}
