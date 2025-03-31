import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "ambassador" | "member";
}

export default function ProtectedRoute({ 
  children,
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Redirect to="/auth" />;
  }
  
  // If a specific role is required, check if the user has that role
  if (requiredRole) {
    // For "member" role, any authenticated user can access
    if (requiredRole === "member") {
      return <>{children}</>;
    }
    
    // For "ambassador" role, user must be either an ambassador or admin
    if (requiredRole === "ambassador" && 
        (user.role === "ambassador" || user.role === "admin")) {
      return <>{children}</>;
    }
    
    // For "admin" role, user must be an admin
    if (requiredRole === "admin" && user.role === "admin") {
      return <>{children}</>;
    }
    
    // If user doesn't have the required role, redirect to dashboard
    return <Redirect to="/dashboard" />;
  }
  
  return <>{children}</>;
}