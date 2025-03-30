import { Button } from "@/components/ui/button";
import { MapPin, Calendar, PartyPopper } from "lucide-react";
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
  return (
    <div
      className={`clay-card ${color} text-white overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:${color.replace("bg-", "bg-")}/95 group cursor-pointer`}
    >
      <div className="h-48 relative overflow-hidden rounded-t-2xl">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/10"></div>
        <div className="absolute top-4 left-4 bg-white/20 text-white font-bold px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-500 group-hover:bg-white/30">
          {date}
        </div>
      </div>
      <div className="p-6 relative">
        <h3 className="font-bold text-2xl mb-3">{title}</h3>
        <p className="text-white/80 mb-4">{description}</p>
        <div className="flex items-center text-white/90 font-medium">
          <MapPin className="w-4 h-4 mr-2 transition-transform duration-500 group-hover:scale-110" />
          <span>{location}</span>
        </div>

        {/* Decorative elements with transitions */}
        {index % 3 === 0 && (
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full transition-all duration-700 group-hover:bg-white/20"></div>
        )}
        {index % 3 === 1 && (
          <div className="absolute -top-10 -right-6 w-24 h-24 bg-white/10 rounded-3xl rotate-12 transition-all duration-700 group-hover:bg-white/20"></div>
        )}
        {index % 3 === 2 && (
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-white/10 rounded-full transition-all duration-700 group-hover:bg-white/20"></div>
        )}
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
