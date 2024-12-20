import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDefaultLogin, setShowDefaultLogin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        // If user is logged in, create a company_users entry
        const setupUser = async () => {
          try {
            // First, check if user already has a company_users entry
            const { data: existingUser, error: checkError } = await supabase
              .from('company_users')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (checkError) {
              console.error("Error checking existing user:", checkError);
            }

            if (!existingUser) {
              console.log("Creating new company_users entry");
              // If no entry exists, get the first active company
              const { data: companies, error: companyError } = await supabase
                .from('companies')
                .select('id')
                .eq('status', 'active')
                .single();

              if (companyError) {
                console.error("Error fetching company:", companyError);
                toast({
                  title: "Error",
                  description: "No active company found. Please contact support.",
                  variant: "destructive",
                });
                return;
              }

              if (companies) {
                const { error: insertError } = await supabase
                  .from('company_users')
                  .insert([
                    {
                      user_id: session.user.id,
                      company_id: companies.id,
                      role: 'technician'
                    }
                  ]);

                if (insertError) {
                  console.error("Error creating company_users entry:", insertError);
                  toast({
                    title: "Error",
                    description: "Failed to setup user account. Please contact support.",
                    variant: "destructive",
                  });
                  return;
                }
              }
            }

            // Navigate to dashboard after setup
            navigate("/");
          } catch (error) {
            console.error("Error in setupUser:", error);
            toast({
              title: "Error",
              description: "Failed to setup user account. Please contact support.",
              variant: "destructive",
            });
          }
        };

        setupUser();
      }
    });
  }, [navigate, toast]);

  const handleDefaultLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'eaglevision.dev30@gmail.com',
        password: 'Eaglevision@today2020'
      });

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          // If login fails, try to sign up
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'eaglevision.dev30@gmail.com',
            password: 'Eaglevision@today2020'
          });

          if (signUpError) {
            toast({
              title: "Error",
              description: "Failed to create default account. " + signUpError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success",
              description: "Default account created. Please check your email for verification.",
            });
          }
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-primary mb-2">Eagle Vision</h1>
          <p className="text-gray-500 text-center">Sign in to your account or create a new one</p>
        </div>
        {!showDefaultLogin ? (
          <div className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => setShowDefaultLogin(true)}
            >
              Continue with Default Login
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
          </div>
        ) : null}
        {showDefaultLogin ? (
          <Button 
            className="w-full mb-4" 
            onClick={handleDefaultLogin}
          >
            Login with Default Credentials
          </Button>
        ) : null}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 rounded-md',
              input: 'w-full px-3 py-2 border rounded-md',
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
        />
      </Card>
    </div>
  );
};

export default Login;