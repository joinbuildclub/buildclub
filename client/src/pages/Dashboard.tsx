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
import DashboardHeader from "@/components/DashboardHeader";
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
    <div className="min-h-screen bg-gray-50 dashboard-font">
      <DashboardHeader />
      
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 dashboard-heading">Dashboard</h1>
        <Tabs defaultValue="registrations" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border border-gray-200 shadow-sm dashboard-font">
            <TabsTrigger 
              value="registrations" 
              className="data-[state=active]:bg-[--color-green]/10 data-[state=active]:text-[--color-green] data-[state=active]:border-b-2 data-[state=active]:border-[--color-green] data-[state=active]:shadow-none rounded-none px-6"
            >
              Registrations
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-[--color-green]/10 data-[state=active]:text-[--color-green] data-[state=active]:border-b-2 data-[state=active]:border-[--color-green] data-[state=active]:shadow-none rounded-none px-6"
            >
              Events
            </TabsTrigger>
            {user?.role === "admin" && (
              <TabsTrigger 
                value="hubs" 
                className="data-[state=active]:bg-[--color-green]/10 data-[state=active]:text-[--color-green] data-[state=active]:border-b-2 data-[state=active]:border-[--color-green] data-[state=active]:shadow-none rounded-none px-6"
              >
                Hubs
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="registrations">
            <Card className="border border-gray-200 shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100">
                <CardTitle className="dashboard-heading">Event Registration Management</CardTitle>
                <CardDescription>
                  View and manage people who have registered for BuildClub events.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {isLoadingRegistrations ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[--color-green]" />
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
            <Card className="border border-gray-200 shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100">
                <CardTitle className="dashboard-heading">Event Management</CardTitle>
                <CardDescription>
                  Create and manage BuildClub events across all locations.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {isLoadingEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[--color-green]" />
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
            <Card className="border border-gray-200 shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100">
                <CardTitle className="dashboard-heading">Hub Management</CardTitle>
                <CardDescription>
                  Manage BuildClub locations around the world.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {isLoadingHubs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[--color-green]" />
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
    </div>
  );
}