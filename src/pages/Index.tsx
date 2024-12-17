import { Layout } from "@/components/Layout";
import { CreateCompanyForm } from "@/components/CreateCompanyForm";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: userRole, isLoading: isLoadingRole } = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      console.log("Fetching user role");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('company_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }

      console.log("User role:", data?.role);
      return data?.role;
    },
  });

  const { data: userCompany, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['userCompany'],
    queryFn: async () => {
      console.log("Fetching user company");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('company_users')
        .select(`
          company:companies (
            id,
            name,
            created_at,
            is_approved,
            pending_approval
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company:', error);
        throw error;
      }

      console.log("User company:", data?.company);
      return data?.company;
    },
  });

  if (isLoadingRole || isLoadingCompany) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <div>Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {userRole === 'super_admin' && (
          <AdminDashboard />
        )}

        {!userCompany && (
          <div className="max-w-md mx-auto">
            <CreateCompanyForm />
          </div>
        )}

        {userCompany && (
          <div>
            <h1 className="text-3xl font-bold">Welcome to {userCompany.name}</h1>
            {userCompany.pending_approval && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  Your company registration is pending approval. You'll be notified once it's approved.
                </p>
              </div>
            )}
            {!userCompany.is_approved && !userCompany.pending_approval && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">
                  Your company registration was not approved. Please contact support for more information.
                </p>
              </div>
            )}
            {userCompany.is_approved && (
              <div className="mt-4">
                {/* Add dashboard content here */}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;