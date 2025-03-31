import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  formatDisplayDate,
  formatTimeRange,
} from "@/lib/dateUtils";

interface UserRegistration {
  registration: {
    id: number;
    hubEventId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
  };
  event: {
    id: number;
    title: string;
    description: string;
    startDateTime: string;
    endDateTime?: string;
    eventType: string;
    focusAreas: string[];
    isPublished: boolean;
  };
  hub: {
    id: number;
    name: string;
  };
  hubEvent: {
    id: number;
    hubId: number;
    eventId: number;
    isPrimary: boolean;
  };
}

export default function UserRegistrations() {
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<number | null>(null);

  // Fetch user's registrations
  const {
    data: registrations = [],
    isLoading,
    error,
  } = useQuery<UserRegistration[]>({
    queryKey: ["/api/my-registrations"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: 1, // Limit retries to avoid potential infinite loops
  });

  // Mutation for cancelling registration
  const cancelRegistration = useMutation({
    mutationFn: async (registrationId: number) => {
      return apiRequest("DELETE", `/api/registrations/${registrationId}`);
    },
    onSuccess: () => {
      toast({
        title: "Registration cancelled",
        description: "You have been unregistered from this event",
        variant: "default",
      });
      
      // Close dialog and clear selected registration
      setCancelDialogOpen(false);
      setSelectedRegistrationId(null);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/my-registrations"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          "Unable to cancel registration. Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle cancel button click
  const handleCancelClick = (registrationId: number) => {
    setSelectedRegistrationId(registrationId);
    setCancelDialogOpen(true);
  };

  // Handle cancel confirmation
  const confirmCancel = () => {
    if (selectedRegistrationId) {
      cancelRegistration.mutate(selectedRegistrationId);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "registered":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Registered
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Confirmed
          </Badge>
        );
      case "attended":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            Attended
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
        <AlertCircle className="h-5 w-5 inline-block mr-2" />
        Error loading your registrations. Please try again later.
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <div className="mb-4">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Registrations Yet</h3>
        <p className="text-gray-500 mb-4">
          You haven't registered for any events. Check out our upcoming events!
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.href = "/events"}
          className="mx-auto"
        >
          Browse Events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Event Registrations</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {registrations.map((item) => (
          <Card key={item.registration.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="mb-1">{item.event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.event.description}
                  </CardDescription>
                </div>
                <StatusBadge status={item.registration.status} />
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDisplayDate(item.event.startDateTime || "")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {formatTimeRange(
                    item.event.startDateTime || "",
                    item.event.endDateTime || ""
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {item.hub.name}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.event.focusAreas.map((focus, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs"
                  >
                    {focus}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-2 px-4">
              <div className="w-full flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Registered on{" "}
                  {new Date(item.registration.createdAt).toLocaleDateString()}
                </div>
                {item.registration.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleCancelClick(item.registration.id)}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel Registration
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your registration for this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelRegistration.isPending}
            >
              Keep Registration
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancel}
              disabled={cancelRegistration.isPending}
            >
              {cancelRegistration.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cancelling...
                </>
              ) : (
                "Cancel Registration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}