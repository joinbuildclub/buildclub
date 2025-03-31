import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "wouter";

const guestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  interestAreas: z.array(z.string()),
  notes: z.string().optional(),
});

const userSchema = z.object({
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;
type UserFormData = z.infer<typeof userSchema>;

export default function EventRegistrationForm({ 
  hubEventId, 
  isOpen, 
  onClose 
}: { 
  hubEventId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: GuestFormData | UserFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubEventId,
          ...(!user ? {
            firstName: (data as GuestFormData).firstName,
            lastName: (data as GuestFormData).lastName,
            email: (data as GuestFormData).email,
            interestAreas: (data as GuestFormData).interestAreas || [],
          } : {
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
          }),
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success!",
        description: "You're registered for the event.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
        </DialogHeader>

        {!user && (
          <DialogDescription>
            <div className="my-6 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700">
              <p className="text-sm">
                <span className="font-semibold">Note:</span> You're registering as
                a guest. Consider{" "}
                <Link href="/auth" className="underline font-medium">
                  signing up for an account
                </Link>{" "}
                to track your registrations and receive event updates.
              </p>
            </div>
          </DialogDescription>
        )}

        <form onSubmit={user ? userForm.handleSubmit(onSubmit) : guestForm.handleSubmit(onSubmit)}>
          {!user && (
            <>
              <div className="space-y-4 mb-4">
                <div>
                  <Input
                    placeholder="First Name"
                    {...guestForm.register("firstName")}
                  />
                  {guestForm.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {guestForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Last Name"
                    {...guestForm.register("lastName")}
                  />
                  {guestForm.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {guestForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...guestForm.register("email")}
                  />
                  {guestForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {guestForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <Textarea
              placeholder="Any notes or comments? (optional)"
              {...(user ? userForm.register("notes") : guestForm.register("notes"))}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}