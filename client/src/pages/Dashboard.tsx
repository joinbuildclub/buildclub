import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table/data-table";
import { registrationColumns, eventColumns, hubColumns } from "@/components/ui/data-table/columns";
import { Loader2 } from "lucide-react";
import type { 
  Registration as SchemaRegistration,
  Event as SchemaEvent, 
  Hub as SchemaHub 
} from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("registrations");
  
  // Fetch registrations (previously waitlist entries)
  const {
    data: registrations = [] as SchemaRegistration[],
    isLoading: isLoadingRegistrations,
    error: registrationsError,
  } = useQuery<SchemaRegistration[]>({
    queryKey: ["/api/registrations"],
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
    if (registrationsError) {
      toast({
        title: "Error loading registrations",
        description: (registrationsError as Error).message,
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
  }, [registrationsError, eventsError, hubsError, toast]);
  
  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName || user?.username || "there"}!
        </p>
      </div>
      
      <Tabs defaultValue="registrations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="hubs">Hubs</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Event Registration Management</CardTitle>
              <CardDescription>
                View and manage people who have registered for BuildClub events.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {isLoadingRegistrations ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <DataTable
                  columns={registrationColumns}
                  data={registrations}
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