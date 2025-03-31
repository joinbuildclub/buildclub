import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  LogOut, 
  MailPlus, 
  ListChecks,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  User as SchemaUser, 
  Event as SchemaEvent, 
  Hub as SchemaHub 
} from "@shared/schema";

// Local type definition that matches what we get from the API
type User = {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profilePicture: string | null;
  role: "admin" | "ambassador" | "member" | null;
  googleId?: string | null;
  password?: string | null;
};

type WaitlistEntry = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  interestAreas: string[];
  aiInterests?: string;
};

// Type definitions for dialogs
type DialogState = {
  isOpen: boolean;
  type: "event" | "hub" | null;
  data?: any;
};

type EventFormData = {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  eventType: "workshop" | "meetup" | "hackathon" | "conference";
  focusAreas: ("product" | "design" | "engineering" | "general")[];
  capacity?: number;
  isPublished: boolean;
};

type HubFormData = {
  name: string;
  description?: string;
  city: string;
  state?: string;
  country: string;
  address?: string;
  latitude?: string;
  longitude?: string;
};

type HubEventFormData = {
  hubId: number;
  eventId: number;
  isPrimary?: boolean;
  capacity?: number;
};

// Role-specific component for Admin
function AdminDashboard({ user }: { user: User }) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: null,
  });
  const [activeTab, setActiveTab] = useState("waitlist");
  const { toast } = useToast();

  // Queries for data
  const waitlistQuery = useQuery({
    queryKey: ["/api/waitlist"],
    enabled: user.role === "admin"
  });

  const eventsQuery = useQuery({
    queryKey: ["/api/events"],
    enabled: user.role === "admin"
  });

  const hubsQuery = useQuery({
    queryKey: ["/api/hubs"],
    enabled: user.role === "admin"
  });

  const hubEventsQuery = useQuery({
    queryKey: ["/api/hub-events"],
    enabled: false // We'll enable this when needed with query params
  });

  // Function to open dialog
  const openDialog = (type: "event" | "hub", data?: any) => {
    setDialogState({
      isOpen: true,
      type,
      data
    });
  };

  // Function to close dialog
  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      type: null
    });
  };

  // Function to handle event form submission
  const handleEventSubmit = async (data: EventFormData) => {
    try {
      await apiRequest('POST', '/api/events', data);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      closeDialog();
      eventsQuery.refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  // Function to handle hub form submission
  const handleHubSubmit = async (data: HubFormData) => {
    try {
      await apiRequest('POST', '/api/hubs', data);
      toast({
        title: "Success",
        description: "Hub created successfully",
      });
      closeDialog();
      hubsQuery.refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create hub",
        variant: "destructive",
      });
    }
  };

  // Function to handle hub-event assignment
  const handleHubEventSubmit = async (data: HubEventFormData) => {
    try {
      await apiRequest('POST', '/api/hub-events', data);
      toast({
        title: "Success",
        description: "Event assigned to hub successfully",
      });
      hubEventsQuery.refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign event to hub",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-[--color-green]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-[--color-green]" size={20} />
            Admin Controls
          </CardTitle>
          <CardDescription>
            Full access to manage BuildClub community
          </CardDescription>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="hubs">Hubs</TabsTrigger>
          </TabsList>
          
          {/* Waitlist Tab */}
          <TabsContent value="waitlist" className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Waitlist Management</h3>
              {waitlistQuery.isLoading ? (
                <p>Loading waitlist entries...</p>
              ) : waitlistQuery.isError ? (
                <p className="text-destructive">Failed to load waitlist data</p>
              ) : (
                <div className="border rounded-md">
                  <div className="bg-muted px-4 py-3 text-sm font-medium flex justify-between">
                    <span>Email</span>
                    <span>Interest Areas</span>
                  </div>
                  <div className="divide-y max-h-64 overflow-y-auto">
                    {(waitlistQuery.data as WaitlistEntry[] || []).map((entry) => (
                      <div key={entry.id} className="px-4 py-3 text-sm flex justify-between">
                        <span>{entry.email}</span>
                        <span className="text-muted-foreground">
                          {entry.interestAreas.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2 bg-[--color-green] hover:bg-[--color-green]/90"
                >
                  <MailPlus size={16} />
                  Send Batch Invitation
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Events Management</h3>
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-[--color-green] hover:bg-[--color-green]/90"
                onClick={() => openDialog("event")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create Event
              </Button>
            </div>
            {eventsQuery.isLoading ? (
              <p>Loading events...</p>
            ) : eventsQuery.isError ? (
              <p className="text-destructive">Failed to load events</p>
            ) : (
              <div className="border rounded-md">
                <div className="bg-muted px-4 py-3 text-sm font-medium grid grid-cols-6">
                  <span className="col-span-2">Title</span>
                  <span>Type</span>
                  <span>Date</span>
                  <span>Published</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y max-h-64 overflow-y-auto">
                  {(eventsQuery.data as SchemaEvent[] || []).map((event) => (
                    <div key={event.id} className="px-4 py-3 text-sm grid grid-cols-6 items-center">
                      <span className="col-span-2 font-medium">{event.title}</span>
                      <span className="capitalize">{event.eventType}</span>
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      <span>{event.isPublished ? "Yes" : "No"}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                            <path d="M18 2l4 4-14 14H4v-4L18 2z"/>
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Hubs Tab */}
          <TabsContent value="hubs" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Hubs Management</h3>
              <Button 
                variant="default" 
                size="sm"
                className="gap-2 bg-[--color-green] hover:bg-[--color-green]/90"
                onClick={() => openDialog("hub")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create Hub
              </Button>
            </div>
            {hubsQuery.isLoading ? (
              <p>Loading hubs...</p>
            ) : hubsQuery.isError ? (
              <p className="text-destructive">Failed to load hubs</p>
            ) : (
              <div className="border rounded-md">
                <div className="bg-muted px-4 py-3 text-sm font-medium grid grid-cols-5">
                  <span>Name</span>
                  <span>City</span>
                  <span>Country</span>
                  <span>Description</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y max-h-64 overflow-y-auto">
                  {(hubsQuery.data as SchemaHub[] || []).map((hub) => (
                    <div key={hub.id} className="px-4 py-3 text-sm grid grid-cols-5 items-center">
                      <span className="font-medium">{hub.name}</span>
                      <span>{hub.city}</span>
                      <span>{hub.country}</span>
                      <span className="truncate">{hub.description || "N/A"}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                            <path d="M18 2l4 4-14 14H4v-4L18 2z"/>
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog for creating events */}
      {dialogState.isOpen && dialogState.type === "event" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const eventData: EventFormData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                startDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string || undefined,
                startTime: formData.get('startTime') as string || undefined,
                endTime: formData.get('endTime') as string || undefined,
                eventType: formData.get('eventType') as "workshop" | "meetup" | "hackathon" | "conference",
                focusAreas: Array.from(
                  formData.getAll('focusAreas') as string[]
                ) as ("product" | "design" | "engineering" | "general")[],
                capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : undefined,
                isPublished: formData.get('isPublished') === 'true',
              };
              handleEventSubmit(eventData);
            }}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Start Time
                    </label>
                    <input
                      name="startTime"
                      type="time"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      End Time
                    </label>
                    <input
                      name="endTime"
                      type="time"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="eventType"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Focus Areas <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="focusAreas"
                        value="product"
                        className="mr-2"
                      />
                      <label>Product</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="focusAreas"
                        value="design"
                        className="mr-2"
                      />
                      <label>Design</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="focusAreas"
                        value="engineering"
                        className="mr-2"
                      />
                      <label>Engineering</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="focusAreas"
                        value="general"
                        className="mr-2"
                      />
                      <label>General</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Capacity
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Publish Status
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="isPublished"
                        value="true"
                        className="mr-2"
                      />
                      <label>Published</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="isPublished"
                        value="false"
                        defaultChecked
                        className="mr-2"
                      />
                      <label>Draft</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeDialog}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[--color-green] hover:bg-[--color-green]/90"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog for creating hubs */}
      {dialogState.isOpen && dialogState.type === "hub" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Hub</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const hubData: HubFormData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string || undefined,
                city: formData.get('city') as string,
                state: formData.get('state') as string || undefined,
                country: formData.get('country') as string,
                address: formData.get('address') as string || undefined,
                latitude: formData.get('latitude') as string || undefined,
                longitude: formData.get('longitude') as string || undefined,
              };
              handleHubSubmit(hubData);
            }}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      State/Province
                    </label>
                    <input
                      name="state"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="country"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Address
                  </label>
                  <input
                    name="address"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Latitude
                    </label>
                    <input
                      name="latitude"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Longitude
                    </label>
                    <input
                      name="longitude"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeDialog}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[--color-green] hover:bg-[--color-green]/90"
                >
                  Create Hub
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Role-specific component for Ambassador
function AmbassadorDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-4">
      <Card className="border-[--color-green]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="text-[--color-green]" size={20} />
            Ambassador Tools
          </CardTitle>
          <CardDescription>
            Help grow the BuildClub community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Your Invites</h3>
              <p className="text-sm text-muted-foreground">
                As an ambassador, you can invite friends to join BuildClub. Use your personalized link below:
              </p>
              <div className="mt-2 p-2 bg-muted rounded-md text-xs font-mono break-all">
                https://buildclub.com/join?ref={user.username}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2 bg-[--color-green] hover:bg-[--color-green]/90"
          >
            <MailPlus size={16} />
            Send Invites
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Role-specific component for Member
function MemberDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-4">
      <Card className="border-[--color-green]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-[--color-green]" size={20} />
            Member Dashboard
          </CardTitle>
          <CardDescription>
            Access BuildClub community resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">Upcoming Events</h3>
              <p className="text-sm text-muted-foreground">
                Stay tuned for upcoming BuildClub events and meetups!
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-md font-medium mb-2">Community Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start border-[--color-green]/40 text-[--color-green] hover:bg-[--color-green]/5"
                >
                  Discord Community
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start border-[--color-green]/40 text-[--color-green] hover:bg-[--color-green]/5"
                >
                  Learning Materials
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start border-[--color-green]/40 text-[--color-green] hover:bg-[--color-green]/5"
                >
                  Project Showcase
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start border-[--color-green]/40 text-[--color-green] hover:bg-[--color-green]/5"
                >
                  Member Directory
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-[--color-green] text-[--color-green] hover:bg-[--color-green]/10"
          >
            <ListChecks size={16} />
            My Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { user, isLoading, logoutMutation } = useAuth();
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Determine which role-specific components to show
  const showAdminPanel = user.role === "admin";
  const showAmbassadorPanel = user.role === "admin" || user.role === "ambassador";

  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[--color-green]">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName || user.username}!
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0 gap-2 border-[--color-green] text-[--color-green] hover:text-[--color-green] hover:border-[--color-green]/90 hover:bg-[--color-green]/10"
          onClick={handleSignOut}
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="border-[--color-green]/20">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-[--color-green]/10 data-[state=active]:text-[--color-green] data-[state=active]:shadow-none"
          >
            Profile
          </TabsTrigger>
          {showAmbassadorPanel && 
            <TabsTrigger 
              value="ambassador"
              className="data-[state=active]:bg-[--color-green]/10 data-[state=active]:text-[--color-green] data-[state=active]:shadow-none"
            >
              Ambassador
            </TabsTrigger>
          }
          {showAdminPanel && 
            <TabsTrigger 
              value="admin"
              className="data-[state=active]:bg-[--color-green]/10 data-[state=active]:text-[--color-green] data-[state=active]:shadow-none" 
            >
              Admin
            </TabsTrigger>
          }
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <MemberDashboard user={user} />
        </TabsContent>

        {showAmbassadorPanel && (
          <TabsContent value="ambassador" className="space-y-4">
            <AmbassadorDashboard user={user} />
          </TabsContent>
        )}

        {showAdminPanel && (
          <TabsContent value="admin" className="space-y-4">
            <AdminDashboard user={user} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}