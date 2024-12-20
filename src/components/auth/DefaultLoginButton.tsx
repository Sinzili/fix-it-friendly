import { Button } from "@/components/ui/button";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export const DefaultLoginButton = () => {
  const { toast } = useToast();
  
  const handleDefaultLogin = async () => {
    try {
      // Try sign in first
      try {
        await signInWithEmail(
          'eaglevision.dev30@gmail.com',
          'Eaglevision@today2020'
        );
      } catch (signInError) {
        console.log("Sign in failed, attempting signup...");
        
        // If sign in fails, try to sign up
        try {
          await signUpWithEmail(
            'eaglevision.dev30@gmail.com',
            'Eaglevision@today2020'
          );
          
          // After successful signup, try to sign in
          await signInWithEmail(
            'eaglevision.dev30@gmail.com',
            'Eaglevision@today2020'
          );
        } catch (signUpError: any) {
          if (signUpError.message.includes("User already registered")) {
            toast({
              title: "Error",
              description: "Please check your credentials and try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Notice",
              description: "Account created. Please check your email for verification.",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in handleDefaultLogin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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