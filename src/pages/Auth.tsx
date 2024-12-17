import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth errors
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "USER_DELETED") {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
        });
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password recovery email sent",
          description: "Please check your email to reset your password.",
        });
      }
    });

    return () => {
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
            },
          }}
          providers={[]}
          onError={(error) => {
            console.error("Auth error:", error);
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive",
            });
          }}
        />
      </Card>
    </div>
  );
};

export default AuthPage;