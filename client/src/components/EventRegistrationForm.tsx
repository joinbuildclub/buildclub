import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const guestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
});

const userSchema = z.object({
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;
type UserFormData = z.infer<typeof userSchema>;

export default function EventRegistrationForm({
  eventId,
  hubEventId,
  eventTitle,
  onSuccess,
  onCancel,
}: {
  eventId: string;
  hubEventId: string;
  eventTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch event details to display in the form
  const { data: event } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: GuestFormData | UserFormData) => {
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubEventId,
          ...(!user
            ? {
                firstName: (data as GuestFormData).firstName,
                lastName: (data as GuestFormData).lastName,
                email: (data as GuestFormData).email,
                interestAreas: [],
                is_guest: true,
              }
            : {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                userId: user.id,
              }),
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success!",
        description: "You're registered for the event.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date and time
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    }).format(date);
  };

  return (
    <div className="p-0">
      <div className="bg-gray-900 text-white p-6">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Register for {eventTitle}</DialogTitle>
          <p className="text-gray-300 mt-2 text-sm">
            Join us for this exciting event and connect with fellow AI builders
          </p>
        </DialogHeader>
      </div>

      {event && (
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formatDate(event.startDateTime)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{event.hub?.location || "Providence, RI"}</span>
            </div>
            
            {event.hub && (
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span>Hosted by <span className="font-medium text-green-600">{event.hub.name}</span></span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {!user && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700">
            <span className="text-sm">
              <span className="font-semibold">Note:</span> You're registering as a
              guest. Consider{" "}
              <a href="/auth" className="underline font-medium">
                signing up for an account
              </a>{" "}
              to track your registrations and receive event updates.
            </span>
          </div>
        )}

        <form
          onSubmit={
            !user
              ? guestForm.handleSubmit(onSubmit)
              : userForm.handleSubmit(onSubmit)
          }
          className="space-y-4 mt-4"
        >
          {!user ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    {...guestForm.register("firstName")}
                  />
                  {guestForm.formState.errors.firstName && (
                    <span className="text-sm text-red-500">
                      {guestForm.formState.errors.firstName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    {...guestForm.register("lastName")}
                  />
                  {guestForm.formState.errors.lastName && (
                    <span className="text-sm text-red-500">
                      {guestForm.formState.errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...guestForm.register("email")}
                />
                {guestForm.formState.errors.email && (
                  <span className="text-sm text-red-500">
                    {guestForm.formState.errors.email.message}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Registering as:</span> {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-700">Email:</span> {user.email}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Any dietary restrictions, accessibility needs, or questions?"
              className="h-24"
              {...(user
                ? userForm.register("notes")
                : guestForm.register("notes"))}
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be shared with the event organizers.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800" type="submit">
              Complete Registration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}