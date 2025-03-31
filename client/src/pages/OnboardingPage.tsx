import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { AlertCircle, CheckCircle2, UserCircle2 } from "lucide-react";

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
import React from "react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import RoundedCircle from "@/components/shapes/RoundedCircle";

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
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen pb-20 relative overflow-hidden">
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

      <div className="container flex flex-col w-full max-w-5xl mx-auto py-10 justify-center ">
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

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8 mx-auto max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormItem>
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
                  <FormItem>
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
                                    checked={field.value?.includes(interest.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            interest.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== interest.id,
                                            ),
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

              <div className="flex items-center justify-center mt-10">
                <Button
                  type="submit"
                  className="clay-button py-6 px-8 text-lg rounded-2xl shadow-sm w-full sm:w-auto"
                  disabled={onboardingMutation.isPending}
                >
                  {onboardingMutation.isPending
                    ? "Saving..."
                    : "Complete Onboarding"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
