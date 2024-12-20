import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        // If user is logged in, create a company_users entry
        const setupUser = async () => {
          try {
            // First, check if user already has a company_users entry
            const { data: existingUser } = await supabase
              .from('company_users')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            if (!existingUser) {
              console.log("Creating new company_users entry");
              // If no entry exists, create one
              const { data: companies } = await supabase
                .from('companies')
                .select('id')
                .eq('status', 'active')
                .single();

              if (companies) {
                const { error } = await supabase
                  .from('company_users')
                  .insert([
                    {
                      user_id: session.user.id,
                      company_id: companies.id,
                      role: 'technician'
                    }
                  ]);

                if (error) {
                  console.error("Error creating company_users entry:", error);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center text-primary mb-2">Eagle Vision</h1>
          <p className="text-gray-500 text-center">Sign in to your account</p>
        </div>
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