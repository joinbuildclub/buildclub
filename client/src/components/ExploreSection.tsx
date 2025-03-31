import {
  Check,
  Users,
  Lightbulb,
  Code,
  Sparkles,
  Zap,
  PenTool,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import RoundedSquare from "@/components/shapes/RoundedSquare";

interface InterestAreaProps {
  shape: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  description: string;
  topics: string[];
  color: string;
}

function InterestTopic({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 rounded-full px-4 py-2 text-gray-700 text-sm font-medium transition-all duration-300 hover:bg-gray-200 border border-gray-200">
      {children}
    </div>
  );
}

function InterestArea({
  shape,
  icon,
  title,
  description,
  topics,
  color,
}: InterestAreaProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-lg relative group overflow-hidden border-t-8 ${color}`}
    >
      <div className="absolute -top-6 -right-6 opacity-10 transition-all duration-500 group-hover:opacity-20 transform group-hover:scale-110">
        {shape}
      </div>

      <div className="relative z-10">
        <div
          className={`${color.replace("border", "bg")} w-14 h-14 rounded-2xl mb-5 flex items-center justify-center shadow-md`}
        >
          {icon}
        </div>

        <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic, idx) => (
            <InterestTopic key={idx}>{topic}</InterestTopic>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExploreSection() {
  // Create triangle shape for Product interest
  const productShape = (
    <RoundedTriangle
      width="w-48"
      height="h-48"
      color="var(--color-red)"
      rotate="rotate-12"
      shadow={false}
    />
  );

  // Create circle shape for Design interest
  const designShape = (
    <RoundedCircle
      width="w-48"
      height="h-48"
      color="var(--color-blue)"
      shadow={false}
    />
  );

  // Create square shape for Engineering interest
  const engineeringShape = (
    <RoundedSquare
      width="w-48"
      height="h-48"
      color="var(--color-yellow)"
      rotate="rotate-12"
      shadow={false}
    />
  );

  return (
    <section
      id="expectations"
      className="py-24 bg-gray-50 relative overflow-hidden"
    >
      <RoundedSquare
        className="-left-12 top-48 sm:bottom-1/4 hidden sm:block"
        width="w-20 sm:w-36"
        height="h-20 sm:h-36"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <RoundedTriangle
        className="absolute sm:left-48 sm:top-10 top-0 -left-10 hidden sm:block"
        width="w-36 sm:w-24"
        height="h-36 sm:h-24"
        rotate="-rotate-45"
        animateClass="animate-floating-delayed"
        shadow
      />

      <RoundedCircle
        className="absolute right-4 sm:right-48 sm:top-10 top-4 hidden sm:block"
        width="w-24"
        height="h-24"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 text-center">
          <div className="inline-block mb-6">
            <div className="clay-shape bg-gray-700 px-5 py-2">
              <span className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" /> Join The Community
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            What we <span className="text-[var(--color-red)]">explore</span>{" "}
            together
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our community primarily covers these interconnected areas, welcoming
            members from all backgrounds and skill levels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <InterestArea
            shape={productShape}
            icon={<BrainCircuit className="h-7 w-7 text-white" />}
            title="AI Product Strategy"
            description="We discuss how AI transforms product thinking and strategy, exploring both business opportunities and human-centered approaches."
            topics={[
              "AI Product Discovery",
              "User Research",
              "Market Validation",
              "Ethical AI Products",
              "Go-To-Market Strategy",
            ]}
            color="border-[var(--color-red)]"
          />

          <InterestArea
            shape={designShape}
            icon={<PenTool className="h-7 w-7 text-white" />}
            title="AI Design & UX"
            description="We craft delightful AI experiences together, sharing techniques for making advanced technology accessible and intuitive for everyone."
            topics={[
              "AI Interface Design",
              "Information Architecture",
              "Interaction Patterns",
              "Visual Systems",
              "AI User Experience",
            ]}
            color="border-[var(--color-blue)]"
          />

          <InterestArea
            shape={engineeringShape}
            icon={<Zap className="h-7 w-7 text-white" />}
            title="AI Engineering"
            description="We collaborate on implementation challenges, solving tough problems around integrating AI capabilities into meaningful applications."
            topics={[
              "API Integrations",
              "AI Agents",
              "Prompt Engineering",
              "Model Tuning",
              "RAG Systems",
              "AI Infrastructure",
              "Data Processing",
            ]}
            color="border-[var(--color-yellow)]"
          />
        </div>
      </div>
    </section>
  );
}
