import { Layout } from "@/components/Layout";
import { CreateCompanyForm } from "@/components/CreateCompanyForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: userCompany, isLoading, error } = useQuery({
    queryKey: ['userCompany'],
    queryFn: async () => {
      console.log("Fetching user company data");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        throw userError;
      }
      
      if (!user) {
        console.log("No user found");
        return null;
      }

      console.log("User found, fetching company data", user.id);
      const { data, error: companyError } = await supabase
        .from('company_users')
        .select(`
          company:companies (
            id,
            name,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle(); // Using maybeSingle instead of single to avoid error when no company exists

      if (companyError) {
        console.error('Error fetching company:', companyError);
        throw companyError;
      }

      console.log("Company data fetched:", data);
      return data?.company || null;
    },
    retry: 1,
    retryDelay: 1000,
  });

  if (isLoading) {
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

  if (error) {
    console.error('Error:', error);
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-center text-red-600">
            <p className="mb-4">Failed to load company data.</p>
            <p className="text-sm text-gray-600">Please refresh the page to try again.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {!userCompany ? (
          <div className="max-w-md mx-auto">
            <CreateCompanyForm />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">Welcome to {userCompany.name}</h1>
            {/* Add dashboard content here */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;