import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaGoogle } from "react-icons/fa";

interface ConvertGuestAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function ConvertGuestAccountModal({ 
  isOpen, 
  onClose, 
  email 
}: ConvertGuestAccountModalProps) {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  
  const handleGoogleSignIn = () => {
    // Redirect to Google OAuth with the email parameter
    window.location.href = `/auth/google?email=${encodeURIComponent(email)}`;
  };
  
  const handleNavigateToSignUp = () => {
    // Navigate to auth page with email pre-filled
    navigate(`/auth?mode=register&email=${encodeURIComponent(email)}`);
    onClose();
  };
  
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Your Account</DialogTitle>
          <DialogDescription>
            You've registered for an event as a guest. Create a permanent account to manage your registrations and get notified about upcoming events.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            We'll use your email address <strong>{email}</strong> to link your event registration to your new account.
          </p>
          
          <Button 
            className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 border border-gray-300" 
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="text-red-500" />
            <span>Sign in with Google</span>
          </Button>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <Button 
            variant="default"
            onClick={handleNavigateToSignUp}
          >
            Create Account with Email
          </Button>
        </div>
        
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}