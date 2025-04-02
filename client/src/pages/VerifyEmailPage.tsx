import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, AlertCircle } from "lucide-react";
import AnimatedBlob from "@/components/AnimatedBlob";

export default function VerifyEmailPage() {
  const [location, setLocation] = useLocation();
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Extract token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  
  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setVerificationState("error");
        setErrorMessage("Verification token is missing");
        return;
      }
      
      try {
        // Call the verification API
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          setVerificationState("success");
          
          // Redirect to login page after short delay
          setTimeout(() => {
            setLocation("/auth?verified=true");
          }, 3000);
        } else {
          const data = await response.json();
          setVerificationState("error");
          setErrorMessage(data.message || "Verification failed");
        }
      } catch (error) {
        setVerificationState("error");
        setErrorMessage("An error occurred during verification");
        console.error("Email verification error:", error);
      }
    }
    
    verifyEmail();
  }, [token, setLocation]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="absolute top-20 left-20 -z-10 opacity-50">
        <AnimatedBlob color="primary" />
      </div>
      <div className="absolute bottom-20 right-20 -z-10 opacity-50">
        <AnimatedBlob color="secondary" />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {verificationState === "loading" 
                ? "We're verifying your email address..." 
                : verificationState === "success"
                  ? "Your email has been verified successfully!"
                  : "There was a problem verifying your email."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex justify-center py-6">
            {verificationState === "loading" && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            
            {verificationState === "success" && (
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-center text-muted-foreground mt-4">
                  You'll be redirected to the login page in a moment.
                </p>
              </div>
            )}
            
            {verificationState === "error" && (
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-center text-red-500 mt-4">{errorMessage}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            {verificationState === "error" && (
              <Button onClick={() => setLocation("/auth")}>
                Return to login
              </Button>
            )}
            
            {verificationState === "success" && (
              <Button onClick={() => setLocation("/auth")}>
                Go to login
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}