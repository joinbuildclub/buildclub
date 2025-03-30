import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertWaitlistSchema } from "@shared/schema";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Users } from "lucide-react";

// Extend the schema with validation rules
const formSchema = insertWaitlistSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Please select your role"),
  interests: z.string().optional(),
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
      role: "",
      interests: "",
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
        description: "You've been added to our waitlist. We'll be in touch soon!",
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
      {/* Clay-like decorative shapes */}
      <div className="absolute -left-10 bottom-10 w-28 h-28 bg-[var(--color-red)] rounded-full" style={{ boxShadow: '0 10px 0 0 rgba(0,0,0,0.1)' }}></div>
      <div className="absolute right-20 top-40 w-32 h-32 bg-[var(--color-green)] rounded-3xl rotate-12" style={{ boxShadow: '0 8px 0 0 rgba(0,0,0,0.1)' }}></div>
      <div className="absolute right-1/4 bottom-1/3 w-20 h-20 bg-[var(--color-yellow)] rounded-full" style={{ boxShadow: '0 7px 0 0 rgba(0,0,0,0.1)' }}></div>
      
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the <span className="text-[var(--color-red)]">BuildClub</span> Community</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Be part of our fun crew of builders creating cool AI stuff together! Sign up for our upcoming events.
            </p>
          </div>
          
          <div className="clay-card bg-white p-10 border-0 rounded-3xl">
            {formSuccess ? (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Woohoo! You're in!</h3>
                <p className="text-gray-700 mb-6">You're now part of the BuildClub community! We'll be in touch soon about upcoming events and activities.</p>
                <Button 
                  onClick={() => setFormSuccess(false)}
                  className="clay-button bg-[var(--color-green)] text-white font-bold border-0"
                >
                  Join with another email
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-bold mb-2">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" className="border-gray-300 py-6 px-4 rounded-xl transition-all bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm" {...field} />
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
                          <FormLabel className="text-gray-700 font-bold mb-2">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" className="border-gray-300 py-6 px-4 rounded-xl transition-all bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm" {...field} />
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
                        <FormLabel className="text-gray-700 font-bold mb-2">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" className="border-gray-300 py-6 px-4 rounded-xl transition-all bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-bold mb-2">Your Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 py-6 px-4 rounded-xl transition-all bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm h-auto">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="product">Product Manager</SelectItem>
                            <SelectItem value="design">Designer</SelectItem>
                            <SelectItem value="engineering">Engineer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-bold mb-2">What interests you most about AI?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a bit about your interests..." 
                            rows={3} 
                            className="border-gray-300 px-4 py-3 rounded-xl transition-all bg-white focus:outline-none focus:border-[var(--color-blue)] focus:border-2 shadow-sm resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full clay-button bg-[var(--color-red)] text-white font-bold text-lg h-auto py-6 border-0"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Submitting..." : "Join the club"} {!submitMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    By joining, you agree to receive updates about BuildClub events and activities.
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
