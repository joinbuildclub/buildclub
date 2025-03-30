import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertWaitlistSchema } from "@shared/schema";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Users, Square, Circle, Triangle, Twitter } from "lucide-react";
import RoundedTriangle from "@/components/shapes/RoundedTriangle";
import RoundedSquare from "@/components/shapes/RoundedSquare";
import RoundedCircle from "@/components/shapes/RoundedCircle";

// Extend the schema with validation rules
const formSchema = insertWaitlistSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  interestAreas: z.array(z.string()).min(1, "Please select at least one interest area"),
  aiInterests: z.string().optional(),
});

export default function JoinSection() {
  const { toast } = useToast();
  const [formSuccess, setFormSuccess] = useState(false);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      interestAreas: [],
      aiInterests: "",
    },
  });

  // Define mutation
  const submitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/waitlist", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description:
          "You've been added to our waitlist. We'll be in touch soon!",
      });
      setFormSuccess(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong.",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate(values);
  }

  return (
    <section id="join" className="py-24 bg-white relative overflow-hidden">
      <div>
        <RoundedTriangle
          className="top-4 sm:top-0 sm:left-24"
          width="w-24 sm:w-48"
          height="h-24 sm:h-48"
          rotate="-rotate-12"
          animateClass="animate-floating"
          shadow
        />

        <RoundedSquare
          className="right-0 top-8 xl:top-48"
          width="w-24 sm:w-48"
          height="h-24 sm:h-48"
          rotate="rotate-12"
          animateClass="animate-floating-delayed"
          shadow
        />

        <RoundedCircle
          className="top-48 sm:top-16 sm:bottom-1/4 sm:-left-24"
          width="w-16 sm:w-36"
          height="h-16 sm:h-36"
          animateClass="animate-floating-delayed"
          shadow
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-block mb-6">
              <div className="clay-shape bg-[var(--color-blue)] px-5 py-2">
                <span className="text-xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" /> Join Us
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Join the{" "}
              <span className="text-[var(--color-red)]">BuildClub</span>{" "}
              Community
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Be part of our fun crew of builders creating cool AI stuff
              together! Sign up for our upcoming events.
            </p>
          </div>

          <div className="bg-white p-10 border border-gray-200 rounded-3xl">
            {formSuccess ? (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Woohoo! You're in!
                </h3>
                <p className="text-gray-700 mb-6">
                  You're now part of the BuildClub community! We'll be in touch
                  soon about upcoming events and activities.
                </p>
                <Button
                  onClick={() => window.open("https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20BuildClub%20community%20of%20AI%20builders!%20%23BuildClub%20%23AIBuilders", "_blank")}
                  className="clay-button bg-[var(--color-yellow)] text-white font-bold border-0 transition-all duration-500 hover:bg-[var(--color-yellow)]/90"
                >
                  Share on Twitter <Twitter className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-bold mb-2">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your first name"
                              className="border-gray-300 py-6 px-4 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm"
                              {...field}
                            />
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
                          <FormLabel className="text-gray-700 font-bold mb-2">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your last name"
                              className="border-gray-300 py-6 px-4 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm"
                              {...field}
                            />
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
                        <FormLabel className="text-gray-700 font-bold mb-2">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="border-gray-300 py-6 px-4 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm"
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-bold mb-2">
                          Your Interest Areas
                        </FormLabel>
                        <FormControl>
                          <div className="flex justify-center gap-8 py-4">
                            {/* Product Manager - Triangle */}
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={cn(
                                  "relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300",
                                  field.value.includes("product")
                                    ? "ring-4 ring-[var(--color-red)] ring-opacity-50 outline outline-2 outline-[var(--color-red)]"
                                    : "bg-white border-2 border-gray-200 hover:border-[var(--color-red)]/40",
                                )}
                                onClick={() => {
                                  const newValue = [...field.value];
                                  if (newValue.includes("product")) {
                                    field.onChange(
                                      newValue.filter(
                                        (item) => item !== "product",
                                      ),
                                    );
                                  } else {
                                    newValue.push("product");
                                    field.onChange(newValue);
                                  }
                                }}
                              >
                                <div
                                  className="overflow-hidden rounded-lg"
                                  style={{
                                    filter: "url(#round-triangle-icon)",
                                  }}
                                >
                                  <svg
                                    width="0"
                                    height="0"
                                    className="absolute"
                                  >
                                    <defs>
                                      <filter id="round-triangle-icon">
                                        <feGaussianBlur
                                          in="SourceGraphic"
                                          stdDeviation="1"
                                          result="blur"
                                        />
                                        <feColorMatrix
                                          in="blur"
                                          type="matrix"
                                          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9"
                                          result="roundTriangle"
                                        />
                                        <feComposite
                                          in="SourceGraphic"
                                          in2="roundTriangle"
                                          operator="atop"
                                        />
                                      </filter>
                                    </defs>
                                  </svg>
                                  <Triangle
                                    className={cn(
                                      "w-10 h-10 transition-all duration-300",
                                      field.value.includes("product")
                                        ? "text-[var(--color-red)]"
                                        : "text-gray-400",
                                    )}
                                  />
                                </div>
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-medium transition-all duration-300",
                                  field.value.includes("product")
                                    ? "text-[var(--color-red)]"
                                    : "text-gray-500",
                                )}
                              >
                                Product
                              </span>
                            </div>

                            {/* Designer - Circle */}
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={cn(
                                  "relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300",
                                  field.value.includes("design")
                                    ? "ring-4 ring-[var(--color-blue)] ring-opacity-50 outline outline-2 outline-[var(--color-blue)]"
                                    : "bg-white border-2 border-gray-200 hover:border-[var(--color-blue)]/40",
                                )}
                                onClick={() => {
                                  const newValue = [...field.value];
                                  if (newValue.includes("design")) {
                                    field.onChange(
                                      newValue.filter(
                                        (item) => item !== "design",
                                      ),
                                    );
                                  } else {
                                    newValue.push("design");
                                    field.onChange(newValue);
                                  }
                                }}
                              >
                                <Circle
                                  className={cn(
                                    "w-10 h-10 transition-all duration-300",
                                    field.value.includes("design")
                                      ? "text-[var(--color-blue)]"
                                      : "text-gray-400",
                                  )}
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-medium transition-all duration-300",
                                  field.value.includes("design")
                                    ? "text-[var(--color-blue)]"
                                    : "text-gray-500",
                                )}
                              >
                                Design
                              </span>
                            </div>

                            {/* Engineer - Square */}
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={cn(
                                  "relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300",
                                  field.value.includes("engineering")
                                    ? "ring-4 ring-[var(--color-yellow)] ring-opacity-50 outline outline-2 outline-[var(--color-yellow)]"
                                    : "bg-white border-2 border-gray-200 hover:border-[var(--color-yellow)]/40",
                                )}
                                onClick={() => {
                                  const newValue = [...field.value];
                                  if (newValue.includes("engineering")) {
                                    field.onChange(
                                      newValue.filter(
                                        (item) => item !== "engineering",
                                      ),
                                    );
                                  } else {
                                    newValue.push("engineering");
                                    field.onChange(newValue);
                                  }
                                }}
                              >
                                <Square
                                  className={cn(
                                    "w-10 h-10 transition-all duration-300",
                                    field.value.includes("engineering")
                                      ? "text-[var(--color-yellow)]"
                                      : "text-gray-400",
                                  )}
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-medium transition-all duration-300",
                                  field.value.includes("engineering")
                                    ? "text-[var(--color-yellow)]"
                                    : "text-gray-500",
                                )}
                              >
                                Engineering
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aiInterests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-bold mb-2">
                          What interests you most about AI?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a bit about your interests..."
                            rows={3}
                            className="border-gray-300 px-4 py-3 rounded-xl transition-all duration-300 bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full clay-button bg-[var(--color-green)] text-white font-bold text-lg h-auto py-6 border-0 transition-all duration-500 hover:bg-[var(--color-green)]/90 group"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending
                      ? "Submitting..."
                      : "Join the club"}{" "}
                    {!submitMutation.isPending && (
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    By joining, you agree to receive updates about BuildClub
                    events and activities.
                  </p>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
