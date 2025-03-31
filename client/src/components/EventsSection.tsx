import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  MapPin,
  Calendar,
  PartyPopper,
  ArrowRight,
  Clock,
  Briefcase,
  Palette,
  Code,
  Loader2,
} from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { formatDisplayDate, formatTimeRange, extractDateComponents } from "@/lib/dateUtils";

// Focus type for the different areas
type Focus = "product" | "design" | "engineering";

// Define event types from the API
interface Event {
  id: number;
  title: string;
  description: string;
  // New datetime fields
  startDateTime: string;
  endDateTime?: string;
  // Legacy fields for backward compatibility
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  eventType: string;
  focusAreas: Focus[];
  location?: string; 
  isPublished: boolean;
}

interface EventCardProps {
  date: string;
  time?: string;
  title: string;
  description: string;
  location: string;
  focuses: Focus[];
  isHackathon?: boolean;
  dateComponents?: {
    day: string;
    month: string;
    dayOfWeek: string;
  };
}

// Shape component for focus areas
function FocusBadge({ focus }: { focus: Focus }) {
  switch (focus) {
    case "product":
      return (
        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 py-1.5 px-2.5 rounded-md text-xs border border-red-100">
          <div className="w-2.5 h-2.5 bg-[var(--color-red)] rounded-full flex-shrink-0"></div>
          <span className="font-semibold">Product</span>
        </div>
      );
    case "design":
      return (
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 py-1.5 px-2.5 rounded-md text-xs border border-blue-100">
          <div className="w-2.5 h-2.5 bg-[var(--color-blue)] rounded-full flex-shrink-0"></div>
          <span className="font-semibold">Design</span>
        </div>
      );
    case "engineering":
      return (
        <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 py-1.5 px-2.5 rounded-md text-xs border border-yellow-100">
          <div className="w-2.5 h-2.5 bg-[var(--color-yellow)] rounded-sm flex-shrink-0"></div>
          <span className="font-semibold">Engineering</span>
        </div>
      );
    default:
      return null;
  }
}

function EventCard({
  date,
  time,
  title,
  description,
  location,
  focuses,
  isHackathon = false,
  dateComponents,
}: EventCardProps) {
  // Get icon based on primary focus
  const Icon = (focuses && Array.isArray(focuses) && focuses.includes("product"))
    ? Briefcase
    : (focuses && Array.isArray(focuses) && focuses.includes("design"))
      ? Palette
      : (focuses && Array.isArray(focuses) && focuses.includes("engineering"))
        ? Code
        : Calendar;

  // Use the provided date components or extract them from the date string
  const { day, month, dayOfWeek } = dateComponents || extractDateComponents(date);

  return (
    <div
      className={`event-card group cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${isHackathon ? "hackathon-event" : ""}`}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col sm:flex-row">
        {/* Left side with date and decorative element */}
        <div className="sm:w-28 bg-gray-50 p-3 sm:p-4 flex flex-row justify-between sm:flex-col sm:items-center sm:justify-between border-b sm:border-b-0 sm:border-r border-gray-100">
          <div className="flex flex-row sm:flex-col items-center sm:text-center">
            <div className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase sm:mb-1 mr-2 sm:mr-0 tracking-wider">
              {dayOfWeek}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800 mr-2 sm:mr-0 leading-none">{day}</div>
            <div className="text-[10px] sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              {month}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-5">
          <h3 className="font-bold text-xl text-gray-800 mb-2 transition-colors duration-300 group-hover:text-[var(--color-red)]">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>

          {/* Focus area tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {focuses && Array.isArray(focuses) && focuses.map((focus, i) => (
              <FocusBadge key={i} focus={focus} />
            ))}
          </div>

          {/* Event details */}
          <div className="flex items-center text-gray-600 mb-3 text-xs">
            <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{time || "Time TBD"}</span>
          </div>

          <div className="flex items-center text-gray-600 text-xs">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{location}</span>
          </div>
        </div>

        {/* Right side with action button */}
        <div className="hidden sm:flex w-24 flex-col items-center justify-center p-3 bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-[var(--color-red)] hover:bg-transparent p-0 flex flex-col items-center gap-2 h-auto"
          >
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="text-xs font-medium">Details</span>
          </Button>
        </div>
        
        {/* Mobile Details Button */}
        <div className="sm:hidden flex justify-center border-t border-gray-100 p-3 bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-[var(--color-red)] hover:bg-transparent p-2 flex items-center gap-2"
          >
            <span className="text-xs font-medium">View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EventsSection() {
  // Fetch events from the API, filtering for published events from the Providence Hub (ID: 1)
  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    queryFn: () => fetch('/api/events?hubId=1&published=true').then(res => res.json()),
  });

  // We're now using our utility functions from dateUtils.ts instead

  // Process events for display, using our utility functions
  const processedEvents = events.map(event => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    let dateForDisplay: string = '';
    
    // Handle the datetime fields with proper timezone adjustment
    if (event.startDateTime) {
      // Create a date from the UTC datetime string and adjust for the display
      startDate = new Date(event.startDateTime);
      
      // Use the full datetime to create a properly formatted local date string
      dateForDisplay = startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC' // Force timezone to UTC to prevent double conversion
      });
    } else if (event.startDate) {
      // Fall back to using the separate date field
      // For date-only fields, we need to parse it a special way
      const dateParts = event.startDate.split('-');
      if (dateParts.length === 3) {
        // Create date using UTC to avoid timezone shifts
        // Using Date.UTC to specify components in UTC
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JS
        const day = parseInt(dateParts[2], 10);
        const dateObj = new Date(Date.UTC(year, month, day));
        
        dateForDisplay = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC' // Force timezone to UTC to prevent double conversion
        });
      } else {
        dateForDisplay = 'Date TBD';
      }
    } else {
      dateForDisplay = 'Date TBD';
    }
    
    // Similarly for end date
    if (event.endDateTime) {
      endDate = new Date(event.endDateTime);
    }
    
    // Format the time display
    let timeDisplay;
    if (startDate && endDate) {
      // Format time from datetime objects with timezone consideration
      timeDisplay = `${startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' // Force timezone to UTC to prevent double conversion
      })} - ${endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' // Force timezone to UTC to prevent double conversion
      })}`;
    } else {
      // Fallback to the old time fields if datetime fields aren't populated
      const startTimeStr = event.startTime || "";
      const endTimeStr = event.endTime || "";
      timeDisplay = (startTimeStr && endTimeStr) 
        ? `${startTimeStr} - ${endTimeStr}` 
        : startTimeStr || "Time TBD";
    }
    
    // Extract components for the date card with timezone consideration
    const dateComponents = event.startDateTime 
      ? {
          // Extract components from the startDate (now properly adjusted)
          day: startDate!.getUTCDate().toString(), // Use UTC methods
          month: startDate!.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
          dayOfWeek: startDate!.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
        }
      : extractDateComponents(event.startDate);
    
    return {
      id: event.id,
      date: dateForDisplay,
      time: timeDisplay,
      dateComponents, // Pass the extracted components for the date card
      title: event.title,
      description: event.description,
      location: "Providence, RI", // Default location since it's not in our model
      focuses: event.focusAreas,
      isHackathon: event.eventType === 'hackathon'
    };
  });

  return (
    <section id="events" className="py-24 bg-white relative overflow-hidden">
      <RoundedTriangle
        className="sm:left-20 sm:top-1/4"
        width="w-20 sm:w-36"
        height="h-20 sm:h-36"
        rotate="rotate-45"
        animateClass="animate-floating"
        shadow
      />

      <RoundedSquare
        className="right-16 top-20"
        width="w-20 sm:w-36"
        height="h-20 sm:h-36"
        rotate="-rotate-12"
        animateClass="animate-floating-delayed"
        shadow
      />

      <RoundedCircle
        className="left-1/3 top-10"
        width="w-20"
        height="h-20"
        rotate="-rotate-12"
        animateClass="animate-floating"
        shadow
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="clay-shape bg-gray-700 px-5 py-2">
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">Error loading events. Please try again later.</p>
            </div>
          ) : processedEvents.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            processedEvents.map((event, idx) => (
              <EventCard
                key={event.id}
                date={event.date}
                time={event.time}
                title={event.title}
                description={event.description}
                location={event.location}
                focuses={event.focuses}
                isHackathon={event.isHackathon}
                dateComponents={event.dateComponents}
              />
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <Link href="/events">
            <Button className="clay-button bg-[var(--color-yellow)] text-white font-bold px-8 py-4 text-lg h-auto border-0 transition-all duration-500 hover:bg-[var(--color-yellow)]/90 group">
              <PartyPopper className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />{" "}
              View all events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
