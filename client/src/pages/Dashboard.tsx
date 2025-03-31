import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table/data-table";
import { waitlistColumns, eventColumns, hubColumns } from "@/components/ui/data-table/columns";
import { Loader2 } from "lucide-react";
import type { 
  HubEventRegistration as SchemaWaitlistEntry,
  Event as SchemaEvent, 
  Hub as SchemaHub 
} from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("waitlist");
  
  // Fetch waitlist entries
  const {
    data: waitlistEntries = [] as SchemaWaitlistEntry[],
    isLoading: isLoadingWaitlist,
    error: waitlistError,
  } = useQuery<SchemaWaitlistEntry[]>({
    queryKey: ["/api/waitlist"],
    enabled: user?.role === "admin" || user?.role === "ambassador",
  });
  
  // Fetch events
  const {
    data: events = [] as SchemaEvent[],
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useQuery<SchemaEvent[]>({
    queryKey: ["/api/events"],
    enabled: user?.role === "admin" || user?.role === "ambassador",
  });
  
  // Fetch hubs
  const {
    data: hubs = [] as SchemaHub[],
    isLoading: isLoadingHubs,
    error: hubsError,
  } = useQuery<SchemaHub[]>({
    queryKey: ["/api/hubs"],
    enabled: user?.role === "admin",
  });
  
  useEffect(() => {
    // Show errors as toasts
    if (waitlistError) {
      toast({
        title: "Error loading waitlist",
        description: (waitlistError as Error).message,
        variant: "destructive",
      });
    }
    
    if (eventsError) {
      toast({
        title: "Error loading events",
        description: (eventsError as Error).message,
        variant: "destructive",
      });
    }
    
    if (hubsError) {
      toast({
        title: "Error loading hubs",
        description: (hubsError as Error).message,
        variant: "destructive", 
      });
    }
  }, [waitlistError, eventsError, hubsError, toast]);
  
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName || user?.username || "there"}!
        </p>
      </div>
      
      <Tabs defaultValue="waitlist" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="hubs">Hubs</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="waitlist">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Management</CardTitle>
              <CardDescription>
                View and manage people who have signed up for the BuildClub waitlist.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {isLoadingWaitlist ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <DataTable
                  columns={waitlistColumns}
                  data={waitlistEntries}
                  searchColumn="email"
                  searchPlaceholder="Search by email..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>
                Create and manage BuildClub events across all locations.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {isLoadingEvents ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <DataTable
                  columns={eventColumns}
                  data={events}
                  searchColumn="title"
                  searchPlaceholder="Search events..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hubs">
          <Card>
            <CardHeader>
              <CardTitle>Hub Management</CardTitle>
              <CardDescription>
                Manage BuildClub locations around the world.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {isLoadingHubs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <DataTable
                  columns={hubColumns}
                  data={hubs}
                  searchColumn="name"
                  searchPlaceholder="Search hubs..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}