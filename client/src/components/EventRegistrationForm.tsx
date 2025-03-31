import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import RoundedCircle from "./shapes/RoundedCircle";
import RoundedTriangle from "./shapes/RoundedTriangle";
import RoundedSquare from "./shapes/RoundedSquare";

// The form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  interestAreas: z
    .array(z.string())
    .min(1, "Please select at least one interest area"),
  aiInterests: z.string().optional(),
  hubEventId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventRegistrationFormProps {
  eventId: number;
  hubEventId: number;
  eventTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EventRegistrationForm({
  eventId,
  hubEventId,
  eventTitle,
  onSuccess,
  onCancel
}: EventRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      interestAreas: [],
      aiInterests: "",
      hubEventId: hubEventId,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/events/register", data);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register for event");
      }

      // Success! Show toast
      toast({
        title: "Registration successful!",
        description: "You've been registered for the event.",
        variant: "default",
      });
      
      // Invalidate queries to refresh event data
      queryClient.invalidateQueries({ queryKey: ["/api/my-registrations"] });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white border border-gray-100 rounded-xl p-6 shadow-md">
      {/* Decorative shapes */}
      <div className="absolute -top-8 -left-8 z-10 opacity-60">
        <RoundedTriangle width="w-16" height="h-16" shadow rotate="rotate-12" animateClass="animate-floating" />
      </div>
      <div className="absolute -bottom-6 -right-6 z-10 opacity-60">
        <RoundedCircle width="w-12" height="h-12" shadow rotate="-rotate-12" animateClass="animate-floating-delayed" />
      </div>
      <div className="absolute top-1/2 -right-10 z-10 opacity-60">
        <RoundedSquare width="w-14" height="h-14" shadow rotate="rotate-45" animateClass="animate-floating" />
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Register for {eventTitle}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestAreas"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Interest Areas</FormLabel>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="interestAreas"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("product")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "product"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "product"
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Product
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="interestAreas"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("design")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "design"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "design"
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Design
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="interestAreas"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("engineering")}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, "engineering"])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== "engineering"
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Engineering
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aiInterests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us about your AI interests</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What AI topics or technologies are you interested in?"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="clay-button bg-[var(--color-green)] hover:bg-[var(--color-green)]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}