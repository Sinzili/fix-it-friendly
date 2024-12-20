import { Button } from "@/components/ui/button";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export const DefaultLoginButton = () => {
  const { toast } = useToast();
  
  const handleDefaultLogin = async () => {
    try {
      console.log("Starting authentication process...");
      
      // First try to sign in
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
        console.error("Sign in failed, attempting signup...");
        
        // If sign in fails, try to sign up
        try {
          await signUpWithEmail(
            'eaglevision.dev30@gmail.com',
            'Eaglevision@today2020'
          );
          console.log("Sign up successful, attempting sign in...");
          
          // After successful signup, try to sign in again
          await signInWithEmail(
            'eaglevision.dev30@gmail.com',
            'Eaglevision@today2020'
          );
          toast({
            title: "Success",
            description: "Account created and logged in successfully",
          });
        } catch (signUpError: any) {
          console.error("Sign up error:", signUpError);
          if (signUpError.message.includes("User already registered")) {
            toast({
              title: "Error",
              description: "Invalid credentials. Please check your email and password.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to create account. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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