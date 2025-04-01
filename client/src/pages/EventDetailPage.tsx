import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  Share2,
  Loader2,
  AlertTriangle,
  PartyPopper,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import {
  extractDateComponents,
  formatDisplayDate,
  formatTimeRange,
} from "@/lib/dateUtils";

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
  hubEventId?: string;
  // Hub information
  hub?: {
    id: string;
    name: string;
    location?: string;
  };
}

// Shape component for focus areas
function FocusBadge({ focus }: { focus: Focus }) {
  switch (focus) {
    case "product":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
        >
          <div className="w-2 h-2 bg-[var(--color-red)] rounded-full mr-1.5"></div>
          Product
        </Badge>
      );
    case "design":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
        >
          <div className="w-2 h-2 bg-[var(--color-blue)] rounded-full mr-1.5"></div>
          Design
        </Badge>
      );
    case "engineering":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100"
        >
          <div className="w-2 h-2 bg-[var(--color-yellow)] rounded-sm mr-1.5"></div>
          Engineering
        </Badge>
      );
    default:
      return null;
  }
}

export default function EventDetailPage() {
  // Registration dialog state
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { user } = useAuth();

  // Get event ID from URL
  const [, params] = useRoute<{ id: string }>("/events/:id");
  const eventId = params?.id || null;

  // Fetch event data
  const {
    data: event,
    isLoading,
    error,
  } = useQuery<Event>({
    queryKey: ["/api/events", eventId],
    queryFn: () => fetch(`/api/events/${eventId}`).then((res) => res.json()),
    enabled: eventId !== null,
  });

  // Process event date/time
  const processedDateTime = () => {
    if (!event)
      return {
        dateDisplay: "Date TBD",
        timeDisplay: "Time TBD",
        dateComponents: null,
      };

    let startDate: Date | null = null;
    let endDate: Date | null = null;
    let dateForDisplay: string = "";

    // Handle the datetime fields with proper timezone adjustment
    if (event.startDateTime) {
      // Create a date from the UTC datetime string and adjust for the display
      startDate = new Date(event.startDateTime);

      // Use the full datetime to create a properly formatted local date string
      dateForDisplay = startDate.toLocaleDateString("en-US", {
        month: "long",
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
          month: "long",
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

    return { dateDisplay: dateForDisplay, timeDisplay, dateComponents };
  };

  const { dateDisplay, timeDisplay, dateComponents } = event
    ? processedDateTime()
    : {
        dateDisplay: "Date TBD",
        timeDisplay: "Time TBD",
        dateComponents: null,
      };

  // Registration handler
  const handleRegister = () => {
    if (event) {
      setIsRegistrationOpen(true);
    }
  };

  // Share event handler
  const handleShare = () => {
    if (navigator.share && event) {
      navigator
        .share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here to indicate the URL was copied
    }
  };

  return (
    <div className="page-container bg-gray-50 min-h-screen">
      <Navbar />

      <main className="main-content py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/events">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 p-0 hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Events
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-500">Loading event details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-red-800 mb-2">
                Event Not Found
              </h3>
              <p className="text-red-600 mb-6">
                We couldn't find the event you're looking for.
              </p>
              <Link href="/events">
                <Button>Browse All Events</Button>
              </Link>
            </div>
          ) : event ? (
            <div>
              {/* Event header section - matching the EventCard style with gradient date box */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow mb-8">
                <div className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left column with date box - special gradient based on focus area */}
                    <div
                      className={`md:w-48 p-6 flex flex-col items-center justify-center text-white relative overflow-hidden
                      ${
                        event.eventType === "hackathon"
                          ? "bg-gray-100" // Base color for hackathons covered by gradient
                          : event.focusAreas.includes("engineering")
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-500"
                            : event.focusAreas.includes("design")
                              ? "bg-gradient-to-br from-blue-400 to-blue-500"
                              : event.focusAreas.includes("product")
                                ? "bg-gradient-to-br from-red-400 to-red-500"
                                : "bg-gradient-to-br from-purple-400 to-purple-500"
                      }`}
                    >
                      {/* Animated gradient overlay for hackathons */}
                      {event.eventType === "hackathon" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-red)] via-[var(--color-blue)] to-[var(--color-yellow)] animate-gradient-x"></div>
                      )}

                      {/* Date content with z-index to ensure it appears above the gradient */}
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 uppercase">
                          {dateComponents?.dayOfWeek?.substring(0, 3) || ""}
                        </div>
                        <div className="text-4xl font-bold leading-none mt-1 mb-1">
                          {dateComponents?.day || ""}
                        </div>
                        <div className="text-sm font-medium opacity-90 uppercase">
                          {dateComponents?.month || ""}
                        </div>
                      </div>
                    </div>

                    {/* Right column with event details */}
                    <div className="p-6 md:p-8 md:flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.focusAreas.map((focus, idx) => (
                          <FocusBadge key={idx} focus={focus} />
                        ))}

                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-600 border-gray-100"
                        >
                          {event.eventType.charAt(0).toUpperCase() +
                            event.eventType.slice(1)}
                        </Badge>
                      </div>

                      {/* Event title */}
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {event.title}
                      </h1>

                      {/* Description */}
                      <p className="text-gray-600 mb-4">{event.description}</p>

                      {/* Meta info with hub badge */}
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{timeDisplay}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{event.hub?.location || "Providence, RI"}</span>
                        </div>

                        {event.hub && (
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <span>
                              Hosted by{" "}
                              <span className="font-medium text-green-600">
                                {event.hub.name}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Register button */}
                      <div className="flex items-center justify-between w-full gap-x-4">
                        <Button
                          variant="outline"
                          onClick={handleShare}
                          className="h-10 ml-3 w-full"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          onClick={handleRegister}
                          className="bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-md h-10 px-6 w-full"
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* More event details could be added here in the future */}

              {/* Related events (could be added in the future) */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 mb-8">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Other Events You Might Like
                  </h2>

                  <div className="text-center py-8">
                    <PartyPopper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      More upcoming events coming soon!
                    </p>

                    <div className="mt-6">
                      <Link href="/events">
                        <Button variant="outline">Browse All Events</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              {!user && (
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Ready to join us?</h2>
                  <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                    Secure your spot for {event.title} today and connect with
                    other AI builders in your community!
                  </p>
                  <Button
                    onClick={handleRegister}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-md px-10 py-6 text-lg shadow-md"
                    size="lg"
                  >
                    Register Now
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>

      <Footer />

      {/* Event Registration Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {event && (
            <EventRegistrationForm
              eventId={event.id}
              hubEventId={event.hubEventId || "1"}
              eventTitle={event.title}
              onSuccess={() => {
                setIsRegistrationOpen(false);
              }}
              onCancel={() => {
                setIsRegistrationOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
