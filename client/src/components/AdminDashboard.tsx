import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table/data-table";
import { registrationColumns, eventColumns, hubColumns } from "@/components/ui/data-table/columns";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import UserRegistrations from "./UserRegistrations";

import type { 
  Registration as SchemaRegistration,
  Event as SchemaEvent, 
  Hub as SchemaHub 
} from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("registrations");
  
  // Fetch all event registrations
  const {
    data: registrations = [],
    isLoading: isLoadingRegistrations,
    error: registrationsError,
  } = useQuery<any[]>({
    queryKey: ["/api/registrations"],
    enabled: user?.role === "admin" || user?.role === "ambassador",
    // Don't retry too many times to avoid re-render issues
    retry: 1,
  });
  
  // Fetch events
  const {
    data: events = [] as SchemaEvent[],
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useQuery<SchemaEvent[]>({
    queryKey: ["/api/events"],
    enabled: user?.role === "admin" || user?.role === "ambassador",
    // Don't retry too many times to avoid re-render issues
    retry: 1,
  });
  
  // Fetch hubs
  const {
    data: hubs = [] as SchemaHub[],
    isLoading: isLoadingHubs,
    error: hubsError,
  } = useQuery<SchemaHub[]>({
    queryKey: ["/api/hubs"],
    enabled: user?.role === "admin",
    // Don't retry too many times to avoid re-render issues
    retry: 1,
  });
  
  // Handle errors with useEffect hooks to prevent infinite renders
  useEffect(() => {
    if (registrationsError) {
      toast({
        title: "Error loading registrations",
        description: (registrationsError as Error).message,
        variant: "destructive",
      });
    }
  }, [registrationsError, toast]);
  
  useEffect(() => {
    if (eventsError) {
      toast({
        title: "Error loading events",
        description: (eventsError as Error).message,
        variant: "destructive",
      });
    }
  }, [eventsError, toast]);
  
  useEffect(() => {
    if (hubsError) {
      toast({
        title: "Error loading hubs",
        description: (hubsError as Error).message,
        variant: "destructive",
      });
    }
  }, [hubsError, toast]);
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 dashboard-heading">Admin Dashboard</h1>
      
      <Tabs defaultValue="registrations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 dashboard-font">
          {/* Admin tabs */}
          <TabsTrigger value="registrations">
            All Registrations
          </TabsTrigger>
          <TabsTrigger value="events">
            Events
          </TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="hubs">
              Hubs
            </TabsTrigger>
          )}
          {/* Personal tab */}
          <TabsTrigger value="my-registrations">
            My Registrations
          </TabsTrigger>
        </TabsList>
        
        {/* All Registrations tab */}
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
        
        {/* Events tab */}
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
        
        {/* Hubs tab */}
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
        
        {/* My Registrations tab */}
        <TabsContent value="my-registrations">
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="dashboard-heading">My Event Registrations</CardTitle>
              <CardDescription>
                View and manage your registrations for upcoming BuildClub events.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <UserRegistrations />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}