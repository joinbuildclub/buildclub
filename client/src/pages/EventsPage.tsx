import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Calendar,
  Filter,
  MapPin,
  Search,
  X,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  formatDisplayDate,
  formatTimeRange,
  extractDateComponents,
} from "@/lib/dateUtils";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EventRegistrationForm from "@/components/EventRegistrationForm";

// Import the types and components from EventsSection
import { Focus, Event, FocusBadge, EventCard as EventCardComponent, EventCardProps } from "@/components/EventsSection";

interface ProcessedEvent {
  id: string;
  date: string;
  time: string;
  dateComponents?: {
    day: string;
    month: string;
    dayOfWeek: string;
  };
  title: string;
  description: string;
  location: string;
  focuses: Focus[];
  isHackathon: boolean;
  eventType: string;
  hubEventId?: string;
}

interface EventCardProps {
  event: ProcessedEvent;
  onClick: () => void;
  onRegisterClick?: (event: ProcessedEvent) => void;
}

// We're using the shared EventCardComponent imported from EventsSection

export default function EventsPage() {
  // State for filters and registration
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hubEventId, setHubEventId] = useState<string | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const { user } = useAuth();

  // Fetch all published events
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    // Get all published events
    queryFn: () =>
      fetch("/api/events?published=true").then((res) => res.json()),
  });

  // Process events for display
  const processedEvents: ProcessedEvent[] = events.map((event) => {
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
      eventType: event.eventType,
      hubEventId: event.hubEventId, // Pass along the hubEventId
    };
  });

  // Apply filters
  const filteredEvents = processedEvents.filter((event) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply focus filter
    const matchesFocus =
      selectedFocus === "all" || event.focuses.includes(selectedFocus as Focus);

    // Apply event type filter
    const matchesType =
      selectedType === "all" || event.eventType === selectedType;

    return matchesSearch && matchesFocus && matchesType;
  });

  // Sort events by date (most recent first)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = a.dateComponents?.day
      ? new Date(`${a.dateComponents.month} ${a.dateComponents.day}`)
      : new Date();
    const dateB = b.dateComponents?.day
      ? new Date(`${b.dateComponents.month} ${b.dateComponents.day}`)
      : new Date();
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="page-container bg-gray-50">
      <Navbar />

      <main className="main-content">
        {/* Hero section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Find and join our upcoming BuildClub events. Connect with other
              builders, learn new skills, and collaborate on exciting AI
              projects.
            </p>
          </div>
        </div>

        {/* Filters and search */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 md:w-auto w-full">
                <Select value={selectedFocus} onValueChange={setSelectedFocus}>
                  <SelectTrigger className="w-[150px] md:w-[130px]">
                    <SelectValue placeholder="Focus Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px] md:w-[130px]">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>

                {/* Reset filters button */}
                {(selectedFocus !== "all" ||
                  selectedType !== "all" ||
                  searchQuery !== "") && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedFocus("all");
                      setSelectedType("all");
                      setSearchQuery("");
                    }}
                    title="Reset filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Events grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">
                Error loading events. Please try again later.
              </p>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ||
                selectedFocus !== "all" ||
                selectedType !== "all"
                  ? "Try adjusting your filters or search query."
                  : "Check back soon for upcoming events."}
              </p>
              {(searchQuery ||
                selectedFocus !== "all" ||
                selectedType !== "all") && (
                <Button
                  onClick={() => {
                    setSelectedFocus("all");
                    setSelectedType("all");
                    setSearchQuery("");
                  }}
                  variant="outline"
                  className="mx-auto"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Filter indicator */}
              {sortedEvents.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">
                    Showing {sortedEvents.length}{" "}
                    {sortedEvents.length === 1 ? "event" : "events"}
                    {searchQuery ||
                    selectedFocus !== "all" ||
                    selectedType !== "all"
                      ? " matching your filters"
                      : ""}
                  </span>

                  {/* Display active filters as badges */}
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1 px-2 py-1">
                        "{searchQuery}"
                        <button onClick={() => setSearchQuery("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedFocus !== "all" && (
                      <Badge variant="secondary" className="gap-1 px-2 py-1">
                        {selectedFocus.charAt(0).toUpperCase() +
                          selectedFocus.slice(1)}
                        <button onClick={() => setSelectedFocus("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {selectedType !== "all" && (
                      <Badge variant="secondary" className="gap-1 px-2 py-1">
                        {selectedType.charAt(0).toUpperCase() +
                          selectedType.slice(1)}
                        <button onClick={() => setSelectedType("all")}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                {sortedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => {
                      // For now, we'll just log. Later we can implement event details page
                      console.log("Clicked event:", event.id);
                    }}
                    onRegisterClick={(processedEvent) => {
                      // Find the original event in our dataset
                      const eventData = events.find(
                        (e) => e.id === processedEvent.id,
                      );

                      if (eventData) {
                        setSelectedEvent(eventData);
                        // Use the hubEventId from the processed event
                        setHubEventId(processedEvent.hubEventId || null);
                        setIsRegistrationOpen(true);
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Event Registration Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {selectedEvent && hubEventId !== null && (
            <EventRegistrationForm
              eventId={selectedEvent.id}
              hubEventId={hubEventId}
              eventTitle={selectedEvent.title}
              onSuccess={() => {
                setIsRegistrationOpen(false);
                setSelectedEvent(null);
                setHubEventId(null);
              }}
              onCancel={() => {
                setIsRegistrationOpen(false);
                setSelectedEvent(null);
                setHubEventId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
