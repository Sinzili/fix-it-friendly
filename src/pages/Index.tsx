import { Layout } from "@/components/Layout";
import { CreateCompanyForm } from "@/components/CreateCompanyForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: userCompany, isLoading, error } = useQuery({
    queryKey: ['userCompany'],
    queryFn: async () => {
      console.log("Fetching user company data");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found");
        return null;
      }

      console.log("User found, fetching company data", user.id);
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          company:companies (
            id,
            name,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        throw error;
      }

      console.log("Company data fetched:", data);
      return data?.company;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    console.error('Error:', error);
    return (
      <Layout>
        <div>Error loading company data. Please try again.</div>
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