import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTechnicianForm } from "@/components/AddTechnicianForm";
import { AddCustomerForm } from "@/components/AddCustomerForm";
import { LogCallForm } from "@/components/LogCallForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const { data: company, isLoading } = useQuery({
    queryKey: ['userCompany'],
    queryFn: async () => {
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
        .single();

      if (error) throw error;
      return data?.company;
    },
  });

  const handleUpdateCompany = async () => {
    if (!company?.id || !companyName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({ name: companyName })
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company name updated successfully.",
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Error",
        description: "Failed to update company name.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your application settings</p>
        </div>

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="service-calls">Service Calls</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Company Settings</h3>
              {isLoading ? (
                <p>Loading...</p>
              ) : company ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={company.name}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                      <Button 
                        onClick={handleUpdateCompany}
                        disabled={isUpdating || !companyName.trim()}
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(company.created_at).toLocaleDateString()}</p>
                    <p>Status: {company.is_approved ? 'Approved' : company.pending_approval ? 'Pending Approval' : 'Rejected'}</p>
                  </div>
                </div>
              ) : (
                <p>No company found</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="technicians" className="space-y-4">
            <AddTechnicianForm />
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <AddCustomerForm />
          </TabsContent>

          <TabsContent value="service-calls" className="space-y-4">
            <LogCallForm />
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <p className="text-gray-500">Notification settings coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;