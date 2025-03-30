import { Button } from "@/components/ui/button";
import { MapPin, Calendar, PartyPopper, ArrowRight, Clock } from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import RoundedSquare from "@/components/shapes/RoundedSquare";

interface EventCardProps {
  date: string;
  title: string;
  description: string;
  location: string;
  imageSrc: string;
  color: string;
  index: number;
}

function EventCard({
  date,
  title,
  description,
  location,
  imageSrc,
  color,
  index,
}: EventCardProps) {
  // Create shape component based on the index
  const ShapeComponent = 
    index % 3 === 0 ? RoundedTriangle : 
    index % 3 === 1 ? RoundedCircle : 
    RoundedSquare;

  // Get color variable based on the color class
  const colorVar = 
    color === "bg-[var(--color-red)]" ? "var(--color-red)" : 
    color === "bg-[var(--color-blue)]" ? "var(--color-blue)" : 
    "var(--color-yellow)";
    
  return (
    <div className="relative group cursor-pointer transform transition-all duration-500 hover:-translate-y-2">
      {/* Background shape with rotation for clay-like effect */}
      <div className="absolute inset-0 bg-gray-100 rounded-3xl rotate-3 translate-x-2 translate-y-2"></div>
      
      {/* Main card container */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row h-full">
        {/* Left side with image */}
        <div className="md:w-2/5 relative">
          <div className="h-64 md:h-full relative overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Color overlay with brand shape */}
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/20"></div>
            
            {/* Date badge */}
            <div className="absolute bottom-4 left-4 bg-white py-3 px-5 rounded-xl shadow-lg flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-800">{date.split(",")[0].split(" ")[1]}</span>
              <span className="text-xs font-medium text-gray-500 uppercase">{date.split(",")[0].split(" ")[0]}</span>
            </div>
            
            {/* Floating accent shape */}
            <div className="absolute -top-10 -right-10 opacity-50 transition-all duration-500 group-hover:rotate-12">
              <ShapeComponent
                width="w-28"
                height="h-28"
                color={colorVar}
                rotate={index % 2 === 0 ? "rotate-12" : "-rotate-12"}
                shadow
              />
            </div>
          </div>
        </div>
        
        {/* Right side with content */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-2xl mb-3 text-gray-800 group-hover:text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-3 text-gray-400" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              <span>{location}</span>
            </div>
            
            <div className="pt-4">
              <Button className={`${color} text-white px-6 py-2 rounded-full h-auto transition-all duration-300 group-hover:brightness-110 flex items-center gap-2`}>
                RSVP Now
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsSection() {
  return (
    <section id="events" className="py-24 bg-white relative overflow-hidden">
      <RoundedTriangle
        className="absolute left-20 top-1/4"
        width="w-36"
        height="h-36"
        color="var(--color-red)"
        rotate="rotate-45"
        animateClass="animate-floating"
        shadow
      />

      <RoundedSquare
        className="absolute right-16 top-20"
        width="w-36"
        height="h-36"
        color="var(--color-yellow)"
        rotate="-rotate-12"
        animateClass="animate-floating-delayed"
        shadow
      />

      <RoundedCircle
        className="absolute left-1/3 top-10"
        width="w-20"
        height="h-20"
        color="var(--color-blue)"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="clay-shape bg-[var(--color-red)] px-5 py-2">
              <span className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2" /> Events
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Join Our Upcoming{" "}
            <span className="text-[var(--color-blue)]">Events</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Come hang out with us in-person where we collaborate, learn, and
            build cool AI stuff together!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <EventCard
            date="Jun 15, 2023"
            title="AI Product Workshop"
            description="Learn how to identify and validate AI product opportunities with practical exercises and expert feedback."
            location="San Francisco, CA"
            imageSrc="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3269&q=80"
            color="bg-[var(--color-red)]"
            index={0}
          />

          <EventCard
            date="Jul 8-9, 2023"
            title="AI Design Hackathon"
            description="A weekend-long event where designers tackle AI interface challenges and create innovative solutions."
            location="New York, NY"
            imageSrc="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
            color="bg-[var(--color-blue)]"
            index={1}
          />

          <EventCard
            date="Jul 22, 2023"
            title="AI Engineering Summit"
            description="Deep dive into the latest AI engineering practices with hands-on workshops and technical discussions."
            location="Austin, TX"
            imageSrc="https://images.unsplash.com/photo-1582192730841-2a682d7375f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
            color="bg-[var(--color-yellow)]"
            index={2}
          />
        </div>

        <div className="mt-16 text-center">
          <Button className="clay-button bg-[var(--color-yellow)] text-white font-bold px-8 py-4 text-lg h-auto border-0 transition-all duration-500 hover:bg-[var(--color-yellow)]/90 group">
            <PartyPopper className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />{" "}
            View all events
          </Button>
        </div>
      </div>
    </section>
  );
}
