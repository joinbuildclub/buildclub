import { useState } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiGoogle } from "react-icons/si";
import { Loader2, User, LogIn, Mail, Key, UserPlus } from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import Logo from "@/assets/logo.png";
// No need to import the logo, we'll reference it directly

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading, loginMutation, registerMutation } =
    useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
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
    window.location.href = "/auth/google";
  };

  return (
    <div className="page-container flex flex-col md:flex-row bg-gradient-to-b from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <RoundedTriangle
          className="absolute -right-12 top-16"
          width="w-32 sm:w-40"
          height="h-32 sm:h-40"
          rotate="rotate-12"
          animateClass="animate-floating-slow"
          shadow
        />
        <RoundedSquare
          className="absolute -left-16 top-72"
          width="w-32 sm:w-40"
          height="h-32 sm:h-40"
          rotate="-rotate-12"
          animateClass="animate-floating-delayed-slow"
          shadow
        />
        <RoundedCircle
          className="absolute right-20 bottom-20"
          width="w-32 sm:w-36"
          height="h-32 sm:h-36"
          animateClass="animate-floating-slow"
          shadow
        />
      </div>

      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <Card className="p-4 w-full max-w-md shadow-lg bg-white rounded-md border border-gray-200 shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium text-gray-900">
              {activeTab === "login" ? "Log In" : "Sign Up"}
            </CardTitle>
            <p className="text-gray-500">
              {activeTab === "login"
                ? "Welcome back!"
                : "Get started by creating an account"}
            </p>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="">
            <TabsList className="flex justify-center mx-6">
              <TabsTrigger
                value="login"
                className="rounded-md flex items-center justify-center gap-2 w-full"
              >
                <LogIn className="h-4 w-4" /> Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md flex items-center justify-center gap-2 w-full"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-1.5"
                    >
                      <Mail className="h-4 w-4 text-[--color-green]" />
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            email: e.target.value,
                          })
                        }
                        required
                        className="pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-1.5"
                    >
                      <Key className="h-4 w-4 text-[--color-green]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        required
                        className="pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-[--color-green] hover:bg-[--color-green]/90 text-white h-11 font-medium"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign in
                  </Button>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 h-11 font-medium"
                    onClick={handleGoogleLogin}
                  >
                    <SiGoogle className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Use the register mutation to create a new account
                  if (registerData.email && registerData.password) {
                    // Create registration credentials - username is optional in the API now
                    // The server will auto-generate a username from email if not provided
                    registerMutation.mutate({
                      email: registerData.email,
                      password: registerData.password,
                      firstName: registerData.firstName || undefined,
                      lastName: registerData.lastName || undefined,
                      role: "member", // Default role for new users
                    });
                  } else {
                    // Show toast error if fields are missing
                    toast({
                      title: "Missing required fields",
                      description: "Please fill out all required fields.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="flex items-center gap-1.5"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={registerData.firstName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            firstName: e.target.value,
                          })
                        }
                        className="pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="flex items-center gap-1.5"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={registerData.lastName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            lastName: e.target.value,
                          })
                        }
                        className="pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-email"
                      className="flex items-center gap-1.5"
                    >
                      <Mail className="h-4 w-4 text-[--color-green]" />
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        required
                        className="pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="reg-password"
                      className="flex items-center gap-1.5"
                    >
                      <Key className="h-4 w-4 text-[--color-green]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        required
                        className="pl-3 pr-3 border-gray-200 focus:border-[--color-green] focus:ring focus:ring-[--color-green]/20"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-[--color-green] hover:bg-[--color-green]/90 text-white h-11 font-medium"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      "Join the club"
                    )}
                  </Button>

                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 h-11 font-medium"
                    onClick={handleGoogleLogin}
                  >
                    <SiGoogle className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-white relative hidden md:flex flex-col justify-center items-center overflow-hidden border-l border-gray-200">
        {/* Decorative shapes */}
        <div className="absolute w-full h-full pointer-events-none">
          <RoundedCircle
            className="absolute top-[10%] right-[15%]"
            width="w-20 sm:w-24"
            height="h-20 sm:h-24"
            color="var(--color-blue)"
            animateClass="animate-floating"
            shadow
          />
          <RoundedTriangle
            className="absolute bottom-[0%] right-[5%]"
            width="w-24 sm:w-28"
            height="h-24 sm:h-28"
            color="var(--color-red)"
            rotate="rotate-12"
            animateClass="animate-floating-delayed"
            shadow
          />
          <RoundedSquare
            className="absolute bottom-[10%] left-[15%]"
            width="w-16 sm:w-20"
            height="h-16 sm:h-20"
            color="var(--color-yellow)"
            rotate="rotate-12"
            animateClass="animate-floating-slow"
            shadow
          />
        </div>

        <div className="max-w-md space-y-8 p-12 z-10 text-gray-800">
          <div className="space-y-3">
            <img src={Logo} alt="Logo" className="h-20 mx-auto" />
            <p className="text-2xl font-outfit text-gray-600">
              Where AI builders meet IRL
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0 clay-shape">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-xl text-gray-800">
                  Connect with AI enthusiasts
                </h3>
                <p className="text-sm text-gray-600">
                  Meet like-minded individuals passionate about AI and
                  technology
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full flex-shrink-0 clay-shape">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-xl text-gray-800">
                  Attend exclusive events
                </h3>
                <p className="text-sm text-gray-600">
                  Join workshops, hackathons, and social gatherings focused on
                  AI innovation
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0 clay-shape">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-xl text-gray-800">
                  Build together
                </h3>
                <p className="text-sm text-gray-600">
                  Collaborate on projects and share knowledge with the community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
