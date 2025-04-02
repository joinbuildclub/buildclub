import { createContext, ReactNode, useContext, useState } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// User type that matches the API response
type User = {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profilePicture: string | null;
  role: "admin" | "ambassador" | "member" | null;
  googleId?: string | null;
  password?: string | null;
  isOnboarded?: boolean;
  isConfirmed?: boolean;
  twitterHandle?: string | null;
  linkedinUrl?: string | null;
  githubUsername?: string | null;
  bio?: string | null;
  interests?: string[] | null;
};

type RegisterCredentials = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string; // Make username optional, will be generated from email if not provided
  role?: "admin" | "ambassador" | "member" | null; // Make role optional, defaults to "member"
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<any, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<any, Error, RegisterCredentials>;
  resendVerificationEmail: (email: string) => Promise<void>;
  isResendingVerification: boolean;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  
  const {
    data: authData,
    error,
    isLoading,
  } = useQuery<{user: User | null, isAuthenticated: boolean}, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const res = await apiRequest("POST", "/api/auth/login", credentials);
        
        // Check for verification error (403 status)
        if (res.status === 403) {
          const data = await res.json();
          // If this is a verification error, throw with the needsVerification flag
          if (data.needsVerification) {
            throw new Error(data.message || "Email verification required", {
              cause: { needsVerification: true, email: data.email }
            });
          }
        }
        
        return await res.json();
      } catch (err) {
        // Re-throw the error to be handled in onError
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], { 
        user: data.user,
        isAuthenticated: true 
      });
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
    },
    onError: (error: Error) => {
      // Check if this is a verification error
      // @ts-ignore - Need to use any type because Error.cause is not standard yet
      const errorCause = error.cause as any;
      if (errorCause?.needsVerification) {
        toast({
          title: "Email verification required",
          description: error.message,
          variant: "destructive",
        });
        
        // If we received an email in the error, we can offer to resend verification
        if (errorCause?.email) {
          // We could trigger auto-resend here, but better to give the user control
          // Just log for now - the UI component will ask for this email
          console.log("Verification needed for email:", errorCause.email);
        }
      } else {
        // Regular login error
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], { 
        user: null, 
        isAuthenticated: false 
      });
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      // Check if the user needs email verification
      const needsVerification = data.needsVerification === true;
      
      if (needsVerification) {
        // Don't set authenticated if verification is needed
        toast({
          title: "Registration successful",
          description: "Please check your email for a verification link to complete your registration.",
        });
      } else {
        // Set user data if no verification needed (e.g., Google OAuth)
        queryClient.setQueryData(["/api/user"], { 
          user: data.user,
          isAuthenticated: true 
        });
        toast({
          title: "Registration successful",
          description: "Your account has been created and you are now logged in.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const user = authData?.user || null;
  const isAuthenticated = authData?.isAuthenticated || false;
  
  // Function to resend verification email
  const resendVerificationEmail = async (email: string) => {
    if (!email) return;
    
    try {
      setIsResendingVerification(true);
      const response = await apiRequest('POST', '/api/auth/resend-verification', { email });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend verification email');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Verification email sent',
        description: data.message || 'Please check your inbox for the verification link.',
      });
    } catch (error) {
      toast({
        title: 'Failed to resend verification email',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated,
        loginMutation,
        logoutMutation,
        registerMutation,
        resendVerificationEmail,
        isResendingVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}