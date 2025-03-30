import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  PartyPopper,
  ArrowRight,
  Clock,
  Briefcase,
  Palette,
  Code,
} from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import RoundedSquare from "@/components/shapes/RoundedSquare";

// Focus type for the different areas
type Focus = "product" | "design" | "engineering";

interface EventCardProps {
  date: string;
  title: string;
  description: string;
  location: string;
  focuses: Focus[];
  isHackathon?: boolean;
}

// Shape component for focus areas
function FocusBadge({ focus }: { focus: Focus }) {
  switch (focus) {
    case "product":
      return (
        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 py-1 px-2 rounded-md text-xs">
          <div className="w-3 h-3 bg-[var(--color-red)] rounded-tl-md rounded-tr-md rounded-bl-md transform rotate-45"></div>
          <span className="font-medium">Product</span>
        </div>
      );
    case "design":
      return (
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 py-1 px-2 rounded-md text-xs">
          <div className="w-3 h-3 bg-[var(--color-blue)] rounded-full"></div>
          <span className="font-medium">Design</span>
        </div>
      );
    case "engineering":
      return (
        <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 py-1 px-2 rounded-md text-xs">
          <div className="w-3 h-3 bg-[var(--color-yellow)] rounded-md transform rotate-3"></div>
          <span className="font-medium">Engineering</span>
        </div>
      );
    default:
      return null;
  }
}

function EventCard({
  date,
  title,
  description,
  location,
  focuses,
  isHackathon = false,
}: EventCardProps) {
  // Get icon based on primary focus
  const Icon = focuses.includes("product")
    ? Briefcase
    : focuses.includes("design")
      ? Palette
      : focuses.includes("engineering")
        ? Code
        : Calendar;

  // Format the date components
  const dateParts = date.split(" ");
  const day = dateParts[1].replace(",", "");
  const month = dateParts[0];

  return (
    <div className="event-card group cursor-pointer transform transition-all duration-300 hover:-translate-y-1">
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-row">
        {/* Left side with date and decorative element */}
        <div className="w-24 bg-gray-50 p-4 flex flex-col items-center justify-between border-r border-gray-100">
          <div className="mb-2 text-center">
            <div className="text-2xl font-bold text-gray-800">{day}</div>
            <div className="text-sm font-medium text-gray-500 uppercase">
              {month}
            </div>
          </div>
          
          {/* Icon representing the event type */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            focuses.includes("product") ? "bg-red-100" : 
            focuses.includes("design") ? "bg-blue-100" : "bg-yellow-100"
          }`}>
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5">
          <h3 className="font-bold text-xl text-gray-800 mb-2 transition-colors duration-300 group-hover:text-[var(--color-red)]">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>

          {/* Focus area tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {focuses.map((focus, i) => (
              <FocusBadge key={i} focus={focus} />
            ))}
          </div>

          {/* Event details */}
          <div className="flex items-center text-gray-600 mb-3 text-xs">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{date}</span>
          </div>

          <div className="flex items-center text-gray-600 text-xs">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
        </div>

        {/* Right side with action button */}
        <div className="w-24 flex flex-col items-center justify-center p-3 bg-gray-50 border-l border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-[var(--color-red)] hover:bg-transparent p-0 flex flex-col items-center gap-2 h-auto"
          >
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="text-xs font-medium">Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const events = [
    {
      date: "April 17, 2025",
      title: "AI Agents Workshop",
      description:
        "Learn all about AI agents and get hands-on with a practical workshop.",
      location: "Providence, RI",
      focuses: ["engineering"] as Focus[],
    },
    {
      date: "May 15, 2025",
      title: "AI UI/UX Workshop",
      description:
        "Learn about emrging AI UI/UX patterns and how to build impactful interfaces for the age of AI.",
      location: "Providence, RI",
      focuses: ["design"] as Focus[],
    },
    {
      date: "Jun 19, 2025",
      title: "AI Product Strategy Workshop",
      description:
        "Deep dive into the latest AI engineering product strategy best-practices with hands-on workshops and discussions.",
      location: "Providence, RI",
      focuses: ["product"] as Focus[],
    },
    {
      date: "Jul 19, 2025",
      title: "AI Hackathon",
      description:
        "Teamup with product, design, and engineering peers to something impactiful using your AI know-how.",
      location: "Providence, RI",
      isHackathon: true,
      focuses: ["product", "design", "engineering"] as Focus[],
    },
  ];

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
          {events.map((event, idx) => (
            <EventCard
              key={idx}
              date={event.date}
              title={event.title}
              description={event.description}
              location={event.location}
              focuses={event.focuses}
            />
          ))}
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
