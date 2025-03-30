import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleFeatureProps {
  color: "primary" | "secondary" | "accent";
  children: React.ReactNode;
}

function RoleFeature({ color, children }: RoleFeatureProps) {
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-[#EC4899]",
    accent: "text-[#10B981]"
  };

  return (
    <li className="flex items-start">
      <Check className={cn("h-6 w-6 flex-shrink-0 mr-2", colorClasses[color])} />
      <span>{children}</span>
    </li>
  );
}

interface RoleSectionProps {
  title: string;
  badge: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
  color: "primary" | "secondary" | "accent";
  reverse?: boolean;
}

function RoleSection({ 
  title, 
  badge, 
  description, 
  features, 
  imageSrc, 
  imageAlt, 
  color, 
  reverse = false 
}: RoleSectionProps) {
  const colorClasses = {
    primary: {
      badge: "bg-primary/10 text-primary",
      gradient: "from-primary/40 to-transparent"
    },
    secondary: {
      badge: "bg-[#EC4899]/10 text-[#EC4899]",
      gradient: "from-[#EC4899]/40 to-transparent"
    },
    accent: {
      badge: "bg-[#10B981]/10 text-[#10B981]",
      gradient: "from-[#10B981]/40 to-transparent"
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className={cn("order-2", reverse ? "md:order-2" : "md:order-1")}>
        <div className={cn("inline-block font-medium rounded-full px-4 py-1 text-sm mb-4", colorClasses[color].badge)}>
          {badge}
        </div>
        <h3 className="text-2xl md:text-3xl font-sans font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <RoleFeature key={index} color={color}>
              {feature}
            </RoleFeature>
          ))}
        </ul>
      </div>
      <div className={cn("order-1", reverse ? "md:order-1" : "md:order-2", "relative")}>
        <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
          <img 
            src={imageSrc} 
            alt={imageAlt} 
            className="w-full h-full object-cover" 
          />
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r", 
            reverse ? "bg-gradient-to-l" : "bg-gradient-to-r",
            colorClasses[color].gradient
          )}></div>
        </div>
      </div>
    </div>
  );
}

export default function RolesSection() {
  return (
    <section id="roles" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6">Who builds at <span className="bg-gradient-to-r from-primary to-[#EC4899] text-transparent bg-clip-text">BuildClub</span>?</h2>
          <p className="text-lg text-muted-foreground">Our diverse community brings together different skills and perspectives to create innovative AI solutions.</p>
        </div>
        
        <div className="space-y-16">
          <RoleSection 
            title="Product Managers"
            badge="Product"
            description="Product leaders who translate AI capabilities into user-centered experiences. They bridge technical possibilities with market needs, crafting product visions that leverage AI meaningfully."
            features={[
              "Defining AI-enhanced product roadmaps",
              "Balancing technical innovation with user needs",
              "Creating ethical AI product strategies"
            ]}
            imageSrc="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
            imageAlt="Product Managers at BuildClub"
            color="primary"
          />
          
          <RoleSection 
            title="Designers"
            badge="Design"
            description="Experience designers crafting intuitive interfaces for AI tools. They humanize complex AI interactions, ensuring technology remains accessible, ethical, and enjoyable for all users."
            features={[
              "Creating intuitive AI interaction patterns",
              "Designing for transparency and trust",
              "Visualizing complex AI concepts for users"
            ]}
            imageSrc="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
            imageAlt="Designers at BuildClub"
            color="secondary"
            reverse={true}
          />
          
          <RoleSection 
            title="Engineers"
            badge="Engineering"
            description="Technical builders bringing AI innovations to life. They architect AI-powered applications, optimize model performance, and integrate AI capabilities into production-ready solutions."
            features={[
              "Developing scalable AI infrastructure",
              "Integrating AI models into applications",
              "Building AI tools with responsible practices"
            ]}
            imageSrc="https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
            imageAlt="Engineers at BuildClub"
            color="accent"
          />
        </div>
      </div>
    </section>
  );
}
