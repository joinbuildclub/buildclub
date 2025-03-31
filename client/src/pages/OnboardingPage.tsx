import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

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

// Interest options
const interestOptions = [
  { id: "ai_tools", label: "AI Tools" },
  { id: "llms", label: "Large Language Models" },
  { id: "nlp", label: "Natural Language Processing" },
  { id: "computer_vision", label: "Computer Vision" },
  { id: "generative_ai", label: "Generative AI" },
  { id: "ai_ethics", label: "AI Ethics" },
  { id: "robotics", label: "Robotics" },
  { id: "ai_for_good", label: "AI for Good" },
  { id: "ai_startups", label: "AI Startups" },
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
    <div className="container max-w-4xl py-10">
      <PageHeader
        title="Complete Your Profile"
        description="Tell us more about yourself so we can personalize your experience"
      />

      {isSuccess ? (
        <Alert className="bg-green-50 mb-8">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            Profile updated successfully! Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      ) : onboardingMutation.isError ? (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            {onboardingMutation.error.message}
          </AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About You</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself, your background, and what interests you about AI..."
                    className="min-h-[120px]"
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
                  <FormLabel>Twitter Handle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@username"
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
                  <FormLabel>GitHub Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
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
                <FormLabel>LinkedIn Profile URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/username"
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
                  <FormLabel className="text-base">Areas of Interest</FormLabel>
                  <FormDescription>
                    Select the AI topics you're most interested in
                  </FormDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {interestOptions.map((interest) => (
                    <FormField
                      key={interest.id}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={interest.id}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
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
                                          (value) => value !== interest.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
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

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              className="w-full sm:w-auto"
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
  );
}