import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";
import { Lightbulb, ArrowRight } from "lucide-react";
import UserRegistrations from "./UserRegistrations";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-registrations");
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 dashboard-heading">My Dashboard</h1>
      
      {/* Idea Generator CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-50 border-primary/20 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Experience the Magic of AI
                </h3>
                <p className="text-gray-600">
                  Get prototype ideas you can build in 2-3 hours and see AI in action
                </p>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/ideas">
                Get AI Ideas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="my-registrations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 dashboard-font">
          <TabsTrigger value="my-registrations">
            My Registrations
          </TabsTrigger>
          <TabsTrigger value="profile">
            My Profile
          </TabsTrigger>
        </TabsList>
        
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
        
        {/* Profile tab */}
        <TabsContent value="profile">
          <Card className="border border-gray-200 shadow-md">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="dashboard-heading">My Profile</CardTitle>
              <CardDescription>
                View and update your profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p className="text-base font-medium">{user?.username}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-base font-medium">{user?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="text-base font-medium">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Membership</h3>
                    <p className="text-base font-medium capitalize">{user?.role || "member"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}