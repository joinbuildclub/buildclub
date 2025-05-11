import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Clock, MapPin } from "lucide-react";
import { Link } from "wouter";
import { extractDateComponents } from "@/lib/dateUtils";

// Define Focus type locally to avoid circular dependencies
export type Focus = "product" | "design" | "engineering";

// Define a common Event interface to avoid circular dependencies
export interface Event {
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
  eventType: "conference" | "hackathon" | "meetup" | "workshop";
  focusAreas: Focus[];
  location?: string;
  isPublished: boolean;
}

// Local implementation of FocusBadge to avoid circular dependencies
export function FocusBadge({ focus }: { focus: Focus }) {
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

export interface EventCardProps {
  date: string;
  time?: string;
  title: string;
  description: string;
  location: string;
  focuses: Focus[];
  eventType: "conference" | "hackathon" | "meetup" | "workshop";
  dateComponents?: {
    day: string;
    month: string;
    dayOfWeek: string;
  };
  eventId: string;
  hubEventId: string;
  onRegisterClick?: (eventId: string, hubEventId: string) => void;
  showRegisterButton?: boolean;
  linkToDetail?: boolean;
}

export function EventCard({
  date,
  time,
  title,
  description,
  location,
  focuses,
  eventType,
  dateComponents,
  eventId,
  hubEventId,
  onRegisterClick,
  showRegisterButton = true,
  linkToDetail = true,
}: EventCardProps) {
  const { user } = useAuth();

  const mapEventType = (
    eventType: "conference" | "hackathon" | "meetup" | "workshop",
  ) => {
    switch (eventType) {
      case "conference":
        return "Conference";
      case "hackathon":
        return "Hackathon";
      case "meetup":
        return "Meetup";
      case "workshop":
        return "Workshop";
      default:
        return "Event";
    }
  };

  const mappedEventType = mapEventType(eventType);

  // Use the provided date components or extract them from the date string
  const { day, month, dayOfWeek } =
    dateComponents || extractDateComponents(date);

  // Get shortened day of week (Mon, Tue, etc.)
  const shortDayOfWeek = dayOfWeek?.substring(0, 3) || "";

  // Generate gradient classes based on event focus areas
  const generateGradientClass = () => {
    if (!focuses || !Array.isArray(focuses) || focuses.length === 0) {
      // Default gradient if no focus areas
      return "bg-gradient-to-br from-purple-400 to-purple-500";
    }

    // Define color variables
    const colorMap = {
      product: "var(--color-red)",
      design: "var(--color-blue)",
      engineering: "var(--color-yellow)",
    };

    // Get unique focus areas to avoid duplicates
    const uniqueFocuses = [...new Set(focuses)];

    // If only one focus area, make a simple gradient of that color
    if (uniqueFocuses.length === 1) {
      const color = colorMap[uniqueFocuses[0]];
      return `bg-gradient-to-br from-[${color}] to-[${color}]/80`;
    }

    // Two focus areas
    if (uniqueFocuses.length === 2) {
      return `bg-gradient-to-br from-[${colorMap[uniqueFocuses[0]]}] to-[${colorMap[uniqueFocuses[1]]}]`;
    }

    // Three or more focus areas (use the first 3)
    if (uniqueFocuses.length >= 3) {
      return `bg-gradient-to-br from-[${colorMap[uniqueFocuses[0]]}] via-[${colorMap[uniqueFocuses[1]]}] to-[${colorMap[uniqueFocuses[2]]}]`;
    }

    // Default fallback
    return "bg-gradient-to-br from-purple-400 to-purple-500";
  };

  const cardContent = (
    <div className="bg-white rounded-xl overflow-hidden shadow border border-gray-100 flex flex-col md:flex-row group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
      {/* Date section - will be on top for mobile, on left for desktop */}
      <div
        className={`w-full md:w-24 p-4 flex flex-col items-center justify-center text-white relative overflow-hidden bg-gray-800`}
      >
        {/* Dynamic gradient overlay based on focus areas */}
        <div
          className={`absolute inset-0 ${generateGradientClass()} ${mappedEventType === "Hackathon" ? "animate-gradient-x" : ""}`}
        ></div>
        {/* Date content with z-index to ensure it appears above the gradient */}
        <div className="relative z-10 flex md:flex-col items-center">
          <div className="text-sm font-medium opacity-90 mr-2 md:mr-0">
            {shortDayOfWeek.toUpperCase()}
          </div>
          <div className="text-4xl font-bold leading-none mx-2 md:mt-1 md:mb-1 md:mx-0">
            {day}
          </div>
          <div className="text-sm font-medium opacity-90">
            {month.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Middle content section */}
        <div className="flex-1 p-5 flex flex-col justify-center">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {focuses &&
              Array.isArray(focuses) &&
              focuses.map((focus, i) => <FocusBadge key={i} focus={focus} />)}

            <Badge
              variant="outline"
              className="bg-gray-50 text-gray-600 border-gray-100"
            >
              {mappedEventType}
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

        {/* Register button on mobile, arrow on desktop */}
        <div className="flex p-4 md:p-6 justify-end border-t border-gray-100 md:border-0">
          {showRegisterButton && onRegisterClick ? (
            <div className="md:hidden w-full">
              <Button
                variant="secondary"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRegisterClick(eventId, hubEventId);
                }}
              >
                <span className="uppercase tracking-wider">Register</span>
              </Button>
            </div>
          ) : null}
          {/* <div className="hidden md:flex md:w-auto justify-end">
            <div className="flex items-center gap-x-4">
              <Button
                variant="ghost"
                className="gap-x-2 outline outline-border"
              >
                <p className="text-gray-400 text-xl">Register</p>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );

  // Wrap with Link if linkToDetail is true
  if (linkToDetail) {
    return <Link href={`/events/${eventId}`}>{cardContent}</Link>;
  }

  // Otherwise just return the card content
  return cardContent;
}

// Custom wrapper components for specific use cases
export interface EventCardWithProcessedEventProps {
  event: {
    id: string;
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
    hubEventId?: string;
    eventType?: string;
  };
  onClick?: () => void;
  onRegisterClick?: (event: any) => void;
}

// Export the EventCardWrapper component
export function EventCardWrapper({
  event,
  onClick,
  onRegisterClick,
}: EventCardWithProcessedEventProps) {
  const handleRegisterClick = () => {
    if (onRegisterClick && event) {
      onRegisterClick(event);
    }
  };

  return (
    <EventCard
      date={event.date}
      time={event.time}
      title={event.title}
      description={event.description}
      location={event.location}
      focuses={event.focuses}
      eventType={
        event.eventType as "hackathon" | "conference" | "meetup" | "workshop"
      }
      dateComponents={event.dateComponents}
      eventId={event.id}
      hubEventId={event.hubEventId || ""}
      onRegisterClick={onRegisterClick ? handleRegisterClick : undefined}
      showRegisterButton={!!onRegisterClick}
      linkToDetail={true} // Always link to detail page
    />
  );
}
