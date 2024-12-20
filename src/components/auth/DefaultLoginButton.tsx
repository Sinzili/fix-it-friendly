import { Button } from "@/components/ui/button";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export const DefaultLoginButton = () => {
  const { toast } = useToast();
  
  const handleDefaultLogin = async () => {
    try {
      console.log("Starting authentication process...");
      
      // First try to sign up
      try {
        console.log("Attempting to sign up...");
        await signUpWithEmail(
          'eaglevision.dev30@gmail.com',
          'Eaglevision@today2020'
        );
        console.log("Sign up successful or user already exists");
      } catch (signUpError: any) {
        console.log("Sign up result:", signUpError);
        // Ignore user already registered error as we'll try to sign in anyway
        if (!signUpError.message.includes("User already registered")) {
          console.error("Sign up error:", signUpError);
        }
      }
      
      // Then try to sign in
      try {
        console.log("Attempting to sign in...");
        await signInWithEmail(
          'eaglevision.dev30@gmail.com',
          'Eaglevision@today2020'
        );
        console.log("Sign in successful");
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
      } catch (signInError: any) {
        console.error("Sign in error:", signInError);
        toast({
          title: "Error",
          description: "Failed to sign in. Please check your credentials.",
          variant: "destructive",
        });
        throw signInError;
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Button 
      className="w-full" 
      onClick={handleDefaultLogin}
    >
      Login with Default Credentials
    </Button>
  );
};