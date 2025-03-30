import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleFeatureProps {
  children: React.ReactNode;
}

function RoleFeature({ children }: RoleFeatureProps) {
  return (
    <li className="flex items-start">
      <Check className="h-5 w-5 flex-shrink-0 mr-3 text-primary" />
      <span className="text-gray-600">{children}</span>
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
}

function RoleSection({ 
  title, 
  badge, 
  description, 
  features, 
  imageSrc, 
  imageAlt 
}: RoleSectionProps) {
  return (
    <div className="grid md:grid-cols-5 gap-x-12 gap-y-8 items-start py-16 border-t border-gray-200">
      <div className="md:col-span-2">
        <div className="inline-block font-medium rounded-full px-4 py-1 text-sm mb-4 bg-gray-100 text-gray-800">
          {badge}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      </div>
      
      <div className="md:col-span-2">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <RoleFeature key={index}>
              {feature}
            </RoleFeature>
          ))}
        </ul>
      </div>
      
      <div className="md:col-span-1">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full aspect-square object-cover rounded-lg" 
        />
      </div>
    </div>
  );
}

export default function RolesSection() {
  return (
    <section id="roles" className="py-24 bg-white bg-gradient-to-bl from-white via-purple-50/25 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 font-heading">Who builds at <span className="bg-gradient-to-r from-primary to-[#7928CA] text-transparent bg-clip-text">BuildClub</span>?</h2>
          <p className="text-xl text-gray-600 max-w-3xl">
            Our diverse community brings together different skills and perspectives to create innovative AI solutions.
          </p>
        </div>
        
        <div>
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
          />
        </div>
      </div>
    </section>
  );
}
