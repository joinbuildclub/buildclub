import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import {
  AlertCircle,
  CheckCircle2,
  UserCircle2,
  Globe,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import DashboardHeader from "@/components/DashboardHeader";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import RoundedCircle from "@/components/shapes/RoundedCircle";
import { Card, CardContent } from "@/components/ui/card";

// Define schema for onboarding form
const onboardingSchema = z.object({
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters" })
    .max(500, { message: "Bio cannot exceed 500 characters" }),
  twitterHandle: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  linkedinUrl: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  githubUsername: z
    .string()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  interests: z
    .array(z.string())
    .min(1, { message: "Please select at least one interest" }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Interest options with categories and colors
const interestOptions = [
  { id: "ai_tools", label: "AI Tools", color: "bg-red-100 border-red-200" },
  {
    id: "llms",
    label: "Large Language Models",
    color: "bg-blue-100 border-blue-200",
  },
  {
    id: "nlp",
    label: "Natural Language Processing",
    color: "bg-blue-100 border-blue-200",
  },
  {
    id: "computer_vision",
    label: "Computer Vision",
    color: "bg-blue-100 border-blue-200",
  },
  {
    id: "generative_ai",
    label: "Generative AI",
    color: "bg-yellow-100 border-yellow-200",
  },
  {
    id: "ai_ethics",
    label: "AI Ethics",
    color: "bg-purple-100 border-purple-200",
  },
  { id: "robotics", label: "Robotics", color: "bg-green-100 border-green-200" },
  {
    id: "ai_for_good",
    label: "AI for Good",
    color: "bg-green-100 border-green-200",
  },
  {
    id: "ai_startups",
    label: "AI Startups",
    color: "bg-red-100 border-red-200",
  },
];

// Build Club community links
const communityLinks = {
  discord: {
    name: "Discord Community",
    url: "https://discord.gg/JumvhCbabY",
    description: "Join our Discord community to connect with other AI builders",
    icon: "discord",
  },
  twitter: {
    name: "Twitter",
    url: "https://x.com/joinbuildclub",
    icon: "twitter",
  },
  instagram: {
    name: "Instagram",
    url: "https://www.instagram.com/joinbuildclub",
    icon: "instagram",
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/joinbuildclub",
    icon: "linkedin",
  },
};

export default function OnboardingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      bio: "",
      twitterHandle: "",
      linkedinUrl: "",
      githubUsername: "",
      interests: [],
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (values: OnboardingFormData) => {
      const response = await apiRequest("POST", "/api/user/onboard", values);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Onboarding complete!",
        description: "Your profile has been updated successfully.",
      });
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      // Allow time for success message before redirecting
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Onboarding failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: OnboardingFormData) {
    onboardingMutation.mutate(values);
  }

  // If user is already onboarded, redirect to dashboard
  if (user?.isOnboarded === true) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="page-container bg-gradient-to-b from-white via-gray-50 to-gray-100 relative overflow-hidden">
      <DashboardHeader />
      <div className="main-content pb-20">
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

        <div className="container flex flex-col w-full max-w-5xl mx-auto py-10 justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <UserCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3 text-gray-800">
              Complete Your Profile
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us more about yourself so we can personalize your experience
              and connect you with like-minded builders
            </p>
          </div>

          {isSuccess ? (
            <Alert className="bg-green-50 mb-8 border-2 border-green-200 rounded-xl mx-auto max-w-2xl">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                Profile updated successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          ) : onboardingMutation.isError ? (
            <Alert
              variant="destructive"
              className="mb-8 rounded-xl mx-auto max-w-2xl"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                {onboardingMutation.error.message}
              </AlertDescription>
            </Alert>
          ) : null}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* SECTION 1: User Info and Interests */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Your Information
                </h2>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        About You
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself, your background, and what interests you about AI..."
                          className="min-h-[120px] border-2 rounded-xl focus:ring-primary/30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will help us connect you with like-minded members.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="twitterHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Twitter Handle
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@username"
                            className="border-2 rounded-xl focus:ring-primary/30"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="githubUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          GitHub Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="username"
                            className="border-2 rounded-xl focus:ring-primary/30"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel className="font-semibold">
                        LinkedIn Profile URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          className="border-2 rounded-xl focus:ring-primary/30"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem className="mt-8">
                      <div className="mb-4">
                        <FormLabel className="text-base font-semibold">
                          Areas of Interest
                        </FormLabel>
                        <FormDescription>
                          Select the AI topics you're most interested in
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {interestOptions.map((interest) => (
                          <FormField
                            key={interest.id}
                            control={form.control}
                            name="interests"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={interest.id}
                                  className={`flex flex-row items-start space-x-3 space-y-0 rounded-xl border-2 p-4 transition-all duration-200 ${
                                    field.value?.includes(interest.id)
                                      ? interest.color
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        interest.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              interest.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== interest.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-medium cursor-pointer">
                                    {interest.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SECTION 2: External Links */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8">
                <div className="flex items-center mb-6">
                  <Globe className="w-6 h-6 text-primary mr-2" />
                  <h2 className="text-2xl font-semibold">
                    Join Build Club Community
                  </h2>
                </div>

                {/* Discord (full width) */}
                <a
                  href={communityLinks.discord.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mb-4"
                >
                  <Card className="hover:bg-primary/5 transition-colors border-2 border-indigo-200 bg-indigo-50">
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6 fill-indigo-600"
                        >
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {communityLinks.discord.name}
                        </h3>
                        <p className="text-gray-600">
                          {communityLinks.discord.description}
                        </p>
                      </div>
                      <ExternalLink className="ml-auto text-gray-400" />
                    </CardContent>
                  </Card>
                </a>

                {/* Social Links (33.33% each) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Twitter */}
                  <a
                    href={communityLinks.twitter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="hover:bg-primary/5 transition-colors h-full border-2 border-blue-100 bg-blue-50">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-blue-500"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>
                        <span className="font-semibold">
                          {communityLinks.twitter.name}
                        </span>
                      </CardContent>
                    </Card>
                  </a>

                  {/* Instagram */}
                  <a
                    href={communityLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="hover:bg-primary/5 transition-colors h-full border-2 border-pink-100 bg-pink-50">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-pink-100 p-2 rounded-full mr-3">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-pink-500"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </div>
                        <span className="font-semibold">
                          {communityLinks.instagram.name}
                        </span>
                      </CardContent>
                    </Card>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={communityLinks.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="hover:bg-primary/5 transition-colors h-full border-2 border-sky-100 bg-sky-50">
                      <CardContent className="p-4 flex items-center">
                        <div className="bg-sky-100 p-2 rounded-full mr-3">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-sky-600"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </div>
                        <span className="font-semibold">
                          {communityLinks.linkedin.name}
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                </div>
              </div>

              {/* SECTION 3: Complete Button */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8 text-center">
                <Button
                  type="submit"
                  className="clay-button py-6 px-12 text-lg rounded-2xl shadow-sm w-full sm:w-auto"
                  disabled={onboardingMutation.isPending}
                >
                  {onboardingMutation.isPending
                    ? "Saving..."
                    : "Complete Onboarding"}
                </Button>
                <p className="text-gray-500 mt-4">
                  By completing your profile, you'll get personalized AI event
                  recommendations
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
