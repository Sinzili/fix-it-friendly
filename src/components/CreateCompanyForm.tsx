import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function CreateCompanyForm() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Creating company");

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      console.log("Creating company for user:", user.id);

      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name }])
        .select()
        .single();

      if (companyError) throw companyError;

      console.log("Company created:", company);

      // Link user to company
      const { error: linkError } = await supabase
        .from('company_users')
        .insert([{
          user_id: user.id,
          company_id: company.id,
          role: 'admin'
        }]);

      if (linkError) throw linkError;

      console.log("User linked to company");

      // Invalidate the userCompany query to trigger a refetch
      await queryClient.invalidateQueries({ queryKey: ['userCompany'] });

      toast({
        title: "Success",
        description: "Company has been created successfully.",
      });

      // Reset form
      setName("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Create New Company</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company Name</label>
          <Input 
            placeholder="Enter company name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Company"}
        </Button>
      </form>
    </Card>
  );
}