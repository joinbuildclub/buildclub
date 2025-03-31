import { createContext, ReactNode, useContext } from "react";
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
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
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
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
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
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
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
      queryClient.setQueryData(["/api/user"], { 
        user: data.user,
        isAuthenticated: true 
      });
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
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