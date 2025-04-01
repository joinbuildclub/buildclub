import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Calendar,
  PartyPopper,
  Loader2,
} from "lucide-react";
import { EventCard as SharedEventCard, type Focus, type Event as SharedEvent } from "@/components/shared/EventCard";
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

// Now importing Focus type from shared EventCard

// Use the shared Event type from EventCard.tsx
export type Event = SharedEvent;



// Now using the FocusBadge from shared/EventCard.tsx instead of duplicating the implementation

// We now use the shared EventCard component instead of duplicating the implementation

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
  const handleRegisterClick = (event: any) => {
    // If user is not logged in, we'll still show the form but with a notice
    // The form will prefill with user data if available

    // Get the event ID and find the event in our dataset
    const eventId = event.id;
    const eventToRegister = events.find((e) => e.id === eventId);

    if (eventToRegister) {
      // We need to look up the actual hubEventId from the database
      // For AI Agents Workshop
      if (eventId === "e162c112-6b00-498d-a178-9ff568b179f4") {
        const hubEventId = "0dd8cbd3-621c-401e-9749-6c630ea1deea";
        setSelectedEvent(eventToRegister);
        setHubEventId(hubEventId);
        setIsRegistrationOpen(true);
        return;
      }
      // For AI UI/UX Workshop
      if (eventId === "33bc2405-7582-4de0-8304-2e387ebc13e8") {
        const hubEventId = "6d4e00bf-8aea-443e-95a7-b743fd9dd35b";
        setSelectedEvent(eventToRegister);
        setHubEventId(hubEventId);
        setIsRegistrationOpen(true);
        return;
      }
      
      // For other events, we'll need to query the server for the hub event ID
      // But for now, we'll just show an error
      alert("Sorry, this event is not currently open for registration");
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
                <div key={event.id}>
                  {/* Using the EventCard component directly */}
                  <SharedEventCard
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
                    onRegisterClick={(eventId, hubEvtId) => {
                      handleRegisterClick(event);
                    }}
                    showRegisterButton={true}
                    linkToDetail={true}
                  />
                </div>
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
