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
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Creating company with name:", name);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
        throw new Error(userError.message);
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error("No user found");
      }

      console.log("Creating company for user:", user.id);

      // Create company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ 
          name: name.trim(),
          is_approved: false,
          pending_approval: true
        }])
        .select()
        .maybeSingle();

      if (companyError) {
        console.error('Company creation error:', companyError);
        throw new Error(companyError.message);
      }

      if (!companyData) {
        throw new Error("Failed to create company");
      }

      console.log("Company created:", companyData);

      // Link user to company
      const { error: linkError } = await supabase
        .from('company_users')
        .insert([{
          user_id: user.id,
          company_id: companyData.id,
          role: 'admin'
        }]);

      if (linkError) {
        console.error('Link error:', linkError);
        // Cleanup the created company if linking fails
        await supabase
          .from('companies')
          .delete()
          .eq('id', companyData.id);
        throw new Error(linkError.message);
      }

      console.log("User linked to company successfully");

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['userCompany'] });
      await queryClient.invalidateQueries({ queryKey: ['userRole'] });

      toast({
        title: "Success",
        description: "Company has been created and is pending approval.",
      });

      // Reset form
      setName("");
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
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
            className="bg-white"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? "Creating..." : "Create Company"}
        </Button>
      </form>
    </Card>
  );
}