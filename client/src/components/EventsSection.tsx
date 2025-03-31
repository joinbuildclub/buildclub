import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  UserPlus,
} from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import { useQuery } from "@tanstack/react-query";
import { extractDateComponents } from "@/lib/dateUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventRegistrationForm from "./EventRegistrationForm";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

// Focus type for the different areas
type Focus = "product" | "design" | "engineering";

// Define event types from the API
interface Event {
  id: string;
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
  eventId: string;
  hubEventId: string;
  onRegisterClick: (eventId: string, hubEventId: string) => void;
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
  eventId,
  hubEventId,
  onRegisterClick,
}: EventCardProps) {
  const { user } = useAuth();

  // Use the provided date components or extract them from the date string
  const { day, month, dayOfWeek } =
    dateComponents || extractDateComponents(date);

  // Get shortened day of week (Mon, Tue, etc.)
  const shortDayOfWeek = dayOfWeek?.substring(0, 3) || "";

  return (
    <Link href={`/events/${eventId}`}>
      <div
        className={`event-card group transition-all duration-300 ${isHackathon ? "hackathon-event" : ""} cursor-pointer transform hover:-translate-y-1 hover:shadow-xl`}
      >
        <div className="bg-white rounded-xl overflow-hidden shadow border border-gray-100 flex flex-row">
          {/* Left side with date - special animated gradient for hackathons, otherwise based on focus */}
          <div
            className={`w-24 p-4 flex flex-col items-center justify-center text-white relative overflow-hidden
                          ${
                            isHackathon
                              ? "bg-gray-100" // Base color that will be covered by the animated gradient
                              : focuses.includes("engineering")
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
                                : focuses.includes("design")
                                  ? "bg-gradient-to-br from-blue-400 to-blue-500"
                                  : focuses.includes("product")
                                    ? "bg-gradient-to-br from-red-400 to-red-500"
                                    : "bg-gradient-to-br from-purple-400 to-purple-500"
                          }`}
          >
            {/* Animated gradient overlay for hackathons */}
            {isHackathon && (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-red)] via-[var(--color-blue)] to-[var(--color-yellow)] animate-gradient-x"></div>
            )}
            {/* Date content with z-index to ensure it appears above the gradient */}
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90">
                {shortDayOfWeek.toUpperCase()}
              </div>
              <div className="text-4xl font-bold leading-none mt-1 mb-1">
                {day}
              </div>
              <div className="text-sm font-medium opacity-90">
                {month.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Middle content - enhanced with better typography and spacing */}
          <div className="flex-1 p-5 flex flex-col justify-center">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {focuses &&
                Array.isArray(focuses) &&
                focuses.map((focus, i) => <FocusBadge key={i} focus={focus} />)}

              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-600 border-gray-100"
              >
                {isHackathon ? "Hackathon" : "Workshop"}
              </Badge>
            </div>

            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[var(--color-blue)] transition-colors">
              {title}
            </h3>

            <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                <span>{time || "Time TBD"}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Right side with register button - enhanced with animated hover effect */}
          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative overflow-hidden w-full items-center">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hubEventId, setHubEventId] = useState<string | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { user } = useAuth();

  // Fetch events from the API, filtering for published events from the Providence Hub (ID: fff7df05-4a4c-4abb-8957-8857b4e1b8d7)
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["/api/events", "providence-hub"],
    queryFn: () =>
      fetch(
        "/api/events?hubId=fff7df05-4a4c-4abb-8957-8857b4e1b8d7&published=true",
      ).then((res) => res.json()),
    staleTime: 10000, // 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // We're now using our utility functions from dateUtils.ts instead

  // Add some debugging
  console.log("Events data:", events);

  // Process events for display, using our utility functions
  const processedEvents = Array.isArray(events)
    ? events.map((event) => {
        let startDate: Date | null = null;
        let endDate: Date | null = null;
        let dateForDisplay: string = "";

        // Handle the datetime fields with proper timezone adjustment
        if (event.startDateTime) {
          // Create a date from the UTC datetime string and adjust for the display
          startDate = new Date(event.startDateTime);

          // Use the full datetime to create a properly formatted local date string
          dateForDisplay = startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC", // Force timezone to UTC to prevent double conversion
          });
        } else if (event.startDate) {
          // Fall back to using the separate date field
          // For date-only fields, we need to parse it a special way
          const dateParts = event.startDate.split("-");
          if (dateParts.length === 3) {
            // Create date using UTC to avoid timezone shifts
            // Using Date.UTC to specify components in UTC
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JS
            const day = parseInt(dateParts[2], 10);
            const dateObj = new Date(Date.UTC(year, month, day));

            dateForDisplay = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC", // Force timezone to UTC to prevent double conversion
            });
          } else {
            dateForDisplay = "Date TBD";
          }
        } else {
          dateForDisplay = "Date TBD";
        }

        // Similarly for end date
        if (event.endDateTime) {
          endDate = new Date(event.endDateTime);
        }

        // Format the time display
        let timeDisplay;
        if (startDate && endDate) {
          // Format time from datetime objects with timezone consideration
          timeDisplay = `${startDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC", // Force timezone to UTC to prevent double conversion
          })} - ${endDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC", // Force timezone to UTC to prevent double conversion
          })}`;
        } else {
          // Fallback to the old time fields if datetime fields aren't populated
          const startTimeStr = event.startTime || "";
          const endTimeStr = event.endTime || "";
          timeDisplay =
            startTimeStr && endTimeStr
              ? `${startTimeStr} - ${endTimeStr}`
              : startTimeStr || "Time TBD";
        }

        // Extract components for the date card with timezone consideration
        const dateComponents = event.startDateTime
          ? {
              // Extract components from the startDate (now properly adjusted)
              day: startDate!.getUTCDate().toString(), // Use UTC methods
              month: startDate!.toLocaleDateString("en-US", {
                month: "short",
                timeZone: "UTC",
              }),
              dayOfWeek: startDate!.toLocaleDateString("en-US", {
                weekday: "long",
                timeZone: "UTC",
              }),
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
          isHackathon: event.eventType === "hackathon",
        };
      })
    : [];

  // Handle event registration button click
  const handleRegisterClick = (eventId: string, hubEventId: string) => {
    // If user is not logged in, we'll still show the form but with a notice
    // The form will prefill with user data if available

    // Find the event in our dataset
    const eventToRegister = events.find((event) => event.id === eventId);

    if (eventToRegister) {
      setSelectedEvent(eventToRegister);
      setHubEventId(hubEventId);
      setIsRegistrationOpen(true);
    }
  };

  // Close registration dialog
  const handleRegistrationClose = () => {
    setIsRegistrationOpen(false);
    setSelectedEvent(null);
    setHubEventId(null);
  };

  // Handle successful registration
  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    setSelectedEvent(null);
    setHubEventId(null);
  };

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
              <p className="text-red-600">
                Error loading events. Please try again later.
              </p>
            </div>
          ) : processedEvents.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          ) : (
            processedEvents.map((event: any, idx: number) => {
              // Find the hubEvent ID for this event (assuming we're showing Providence Hub events)
              const eventData = Array.isArray(events)
                ? events.find((e) => e.id === event.id)
                : null;
              // The hubEventId should be available in the events data, cast as any to access it
              const hubEventId = (eventData as any)?.hubEventId || "1";

              return (
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
                  eventId={event.id}
                  hubEventId={hubEventId}
                  onRegisterClick={handleRegisterClick}
                />
              );
            })
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

      {/* Event Registration Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {selectedEvent && hubEventId !== null && (
            <EventRegistrationForm
              eventId={selectedEvent.id}
              hubEventId={hubEventId}
              eventTitle={selectedEvent.title}
              onSuccess={handleRegistrationSuccess}
              onCancel={handleRegistrationClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
