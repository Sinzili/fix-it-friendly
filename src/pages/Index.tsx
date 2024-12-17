import { Layout } from "@/components/Layout";
import { CreateCompanyForm } from "@/components/CreateCompanyForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: userCompany, isLoading } = useQuery({
    queryKey: ['userCompany'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('company_users')
        .select('companies (*)')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        return null;
      }

      return data?.companies;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
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
