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
import { ArrowRight } from "lucide-react";

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
    <section id="join" className="py-24 bg-white bg-gradient-to-br from-white via-purple-50/30 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-6 text-gray-900 font-heading">Join the <span className="bg-gradient-to-r from-primary to-[#7928CA] text-transparent bg-clip-text">BuildClub</span> Community</h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Be part of a passionate group of builders creating the future of AI together. Sign up for upcoming events and activities.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-12 shadow-lg border-0">
            {formSuccess ? (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Thanks for joining!</h3>
                <p className="text-gray-600 mb-6">You're now part of the BuildClub community! We'll be in touch soon about upcoming events and activities.</p>
                <Button 
                  onClick={() => setFormSuccess(false)}
                  className="bg-[#370B73] hover:bg-[#370B73]/90 text-white"
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
                          <FormLabel className="text-gray-700 font-medium mb-2">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" className="border-gray-200 py-6 px-4 rounded-lg transition-all bg-white focus:outline-none focus:border-gray-300 shadow-sm" {...field} />
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
                          <FormLabel className="text-gray-700 font-medium mb-2">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" className="border-gray-200 py-6 px-4 rounded-lg transition-all bg-white focus:outline-none focus:border-gray-300 shadow-sm" {...field} />
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
                        <FormLabel className="text-gray-700 font-medium mb-2">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" className="border-gray-200 py-6 px-4 rounded-lg transition-all bg-white focus:outline-none focus:border-gray-300 shadow-sm" {...field} />
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
                        <FormLabel className="text-gray-700 font-medium mb-2">Your Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-200 py-6 px-4 rounded-lg transition-all bg-white focus:outline-none focus:border-gray-300 shadow-sm h-auto">
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
                        <FormLabel className="text-gray-700 font-medium mb-2">What interests you most about AI?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a bit about your interests..." 
                            rows={3} 
                            className="border-gray-200 px-4 py-3 rounded-lg transition-all bg-white focus:outline-none focus:border-gray-300 shadow-sm resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#370B73] hover:bg-[#370B73]/90 text-white font-medium text-lg h-auto py-6 rounded-lg shadow-sm transition-all focus:outline-none focus:bg-[#370B73]/95"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Submitting..." : "Join the club"} {!submitMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    By joining, you agree to receive updates about BuildClub events and community activities.
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
