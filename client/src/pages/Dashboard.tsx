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
import { User as SchemaUser } from "@shared/schema";

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

// Role-specific component for Admin
function AdminDashboard({ user }: { user: User }) {
  const waitlistQuery = useQuery({
    queryKey: ["/api/waitlist"],
    enabled: user.role === "admin"
  });

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
        <CardContent>
          <div className="space-y-4">
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
                  <div className="divide-y">
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
            Send Batch Invitation
          </Button>
        </CardFooter>
      </Card>
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