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
  // Determine shape for the event's decoration
  const Shape = index % 3 === 0 
    ? <div className="w-12 h-12 bg-[var(--color-red)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rotate-45"></div>
    : index % 3 === 1 
    ? <div className="w-12 h-12 bg-[var(--color-blue)] rounded-full"></div>
    : <div className="w-12 h-12 bg-[var(--color-yellow)] rounded-lg rotate-12"></div>;
    
  return (
    <div className="event-card group cursor-pointer transform transition-all duration-300 hover:-translate-y-1">
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-row">
        {/* Left side with date and decorative element */}
        <div className="w-24 bg-gray-50 p-4 flex flex-col items-center justify-between border-r border-gray-100">
          <div className="mb-2 text-center">
            <div className="text-2xl font-bold text-gray-800">{date.split(" ")[1].replace(",", "")}</div>
            <div className="text-sm font-medium text-gray-500 uppercase">{date.split(" ")[0]}</div>
          </div>
          <div className="opacity-80">{Shape}</div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-5">
          <h3 className="font-bold text-xl text-gray-800 mb-2 transition-colors duration-300 group-hover:text-[var(--color-red)]">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          
          {/* Event details */}
          <div className="flex items-center text-gray-600 mb-3 text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
        </div>
        
        {/* Right side with action button */}
        <div className="w-24 flex flex-col items-center justify-center p-3 bg-gray-50 border-l border-gray-100">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[var(--color-red)] hover:bg-transparent p-0 flex flex-col items-center gap-2 h-auto">
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="text-xs font-medium">Details</span>
          </Button>
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

        <div className="flex flex-col space-y-5 max-w-4xl mx-auto">
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
