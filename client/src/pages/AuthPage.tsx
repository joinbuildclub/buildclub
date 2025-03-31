import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiGoogle } from "react-icons/si";
import { Loader2, User, LogIn, Mail, Key, UserPlus } from "lucide-react";
import AnimatedBlob from "@/components/AnimatedBlob";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, loginMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && user) {
    return <Redirect to="/dashboard" />;
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <AnimatedBlob 
        color="primary" 
        className="w-[600px] h-[600px] -top-64 -right-40 opacity-30" 
      />
      <AnimatedBlob 
        color="accent" 
        className="w-[500px] h-[500px] -bottom-40 -left-20 opacity-20" 
      />
      
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <Card className="w-full max-w-md shadow-lg clay-card bg-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome to BuildClub</CardTitle>
            <CardDescription>
              Sign in to access your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger value="login" className="rounded-md flex items-center gap-2">
                <LogIn className="h-4 w-4" /> Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-md flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[--color-green]" />
                      Username
                    </Label>
                    <div className="relative">
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="Enter your username" 
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        required
                        className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-1.5">
                      <Key className="h-4 w-4 text-[--color-green]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Enter your password" 
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                        className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl bg-[--color-green] hover:bg-[--color-green]/90 text-white h-11 font-medium" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Sign in
                  </Button>
                  
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 h-11 font-medium" 
                    onClick={handleGoogleLogin}
                  >
                    <SiGoogle className="mr-2 h-4 w-4 text-red-500" />
                    Sign in with Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-[--color-green]" />
                    Username
                  </Label>
                  <div className="relative">
                    <Input 
                      id="reg-username" 
                      type="text" 
                      placeholder="Choose a username" 
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      required
                      className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-[--color-green]" />
                    Email
                  </Label>
                  <div className="relative">
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                      className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-1.5">
                      First Name
                    </Label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="First name" 
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                      className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-1.5">
                      Last Name
                    </Label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Last name" 
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                      className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-[--color-green]" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="Create a password" 
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                      className="rounded-xl pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="button" 
                  className="w-full rounded-xl bg-[--color-green] hover:bg-[--color-green]/90 text-white h-11 font-medium"
                  onClick={() => {
                    // In a real app, we would handle registration here
                    setActiveTab("login");
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 h-11 font-medium" 
                  onClick={handleGoogleLogin}
                >
                  <SiGoogle className="mr-2 h-4 w-4 text-red-500" />
                  Sign up with Google
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Right side - Hero section */}
      <div className="flex-1 bg-[--color-green] relative hidden md:flex flex-col justify-center items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute w-full h-full bg-[#4CAF50] opacity-10">
          <div className="absolute top-[5%] right-[10%] w-64 h-64 rounded-full bg-white opacity-20"></div>
          <div className="absolute bottom-[15%] left-[5%] w-40 h-40 rounded-[42%_58%_70%_30%/45%_45%_55%_55%] bg-white opacity-20"></div>
          <div className="absolute top-[40%] left-[20%] w-32 h-32 rounded-md bg-white opacity-10" style={{ transform: "rotate(15deg)" }}></div>
        </div>
        
        <div className="max-w-md space-y-8 p-12 z-10 text-white">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight font-outfit">BuildClub</h1>
            <p className="text-2xl font-outfit">Where AI builders meet IRL</p>
          </div>
          
          <div className="space-y-6 mt-8">
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full flex-shrink-0 shadow-inner">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-xl">Connect with AI enthusiasts</h3>
                <p className="text-sm opacity-90">Meet like-minded individuals passionate about AI and technology</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full flex-shrink-0 shadow-inner">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-xl">Attend exclusive events</h3>
                <p className="text-sm opacity-90">Join workshops, hackathons, and social gatherings focused on AI innovation</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full flex-shrink-0 shadow-inner">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-xl">Build together</h3>
                <p className="text-sm opacity-90">Collaborate on projects and share knowledge with the community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}