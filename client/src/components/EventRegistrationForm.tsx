import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const guestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
});

const userSchema = z.object({
  notes: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;
type UserFormData = z.infer<typeof userSchema>;

export default function EventRegistrationForm({ 
  eventId,
  hubEventId,
  eventTitle,
  onSuccess,
  onCancel
}: { 
  eventId: string;
  hubEventId: string;
  eventTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: GuestFormData | UserFormData) => {
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
            interestAreas: [],
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
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle>Register for {eventTitle}</DialogTitle>
      </DialogHeader>

      {!user && (
        <div className="my-6 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700">
          <span className="text-sm">
            <span className="font-semibold">Note:</span> You're registering as
            a guest. Consider{" "}
            <a href="/auth" className="underline font-medium">
              signing up for an account
            </a>{" "}
            to track your registrations and receive event updates.
          </span>
        </div>
      )}

      <form onSubmit={!user ? guestForm.handleSubmit(onSubmit) : userForm.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {!user && (
          <>
            <div className="space-y-2">
              <Input
                placeholder="First Name"
                {...guestForm.register("firstName")}
              />
              {guestForm.formState.errors.firstName && (
                <span className="text-sm text-red-500">
                  {guestForm.formState.errors.firstName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Last Name"
                {...guestForm.register("lastName")}
              />
              {guestForm.formState.errors.lastName && (
                <span className="text-sm text-red-500">
                  {guestForm.formState.errors.lastName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...guestForm.register("email")}
              />
              {guestForm.formState.errors.email && (
                <span className="text-sm text-red-500">
                  {guestForm.formState.errors.email.message}
                </span>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Textarea
            placeholder="Any notes or questions? (Optional)"
            {...(user ? userForm.register("notes") : guestForm.register("notes"))}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}