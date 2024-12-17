import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (session) {
        console.log("User session found, redirecting to home");
        navigate("/");
        return;
      }

      switch (event) {
        case 'SIGNED_OUT':
          console.log("User signed out");
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
          break;
        case 'USER_UPDATED':
          console.log("User updated");
          break;
        case 'PASSWORD_RECOVERY':
          console.log("Password recovery initiated");
          toast({
            title: "Password recovery email sent",
            description: "Please check your email to reset your password.",
          });
          break;
        case 'TOKEN_REFRESHED':
          console.log("Token refreshed");
          break;
        default:
          if (event === 'SIGNED_IN' && !session) {
            console.error("Sign in failed:", event);
            setError("Sign in failed. Please check your credentials and try again.");
          }
      }
    });

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session, "Error:", error);
      if (session) {
        console.log("User already logged in, redirecting to home");
        navigate("/");
      }
    };

    checkUser();

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center">Eagle Vision</h1>
          <p className="text-center text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000',
                  brandAccent: '#666',
                },
              },
            },
            className: {
              container: 'flex flex-col gap-4',
              button: 'w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800',
              input: 'w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black focus:border-transparent',
              message: 'text-red-600 text-sm',
              anchor: 'text-black hover:text-gray-600',
            },
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default AuthPage;