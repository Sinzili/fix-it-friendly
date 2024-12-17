import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building } from "lucide-react";

export function CreateCompanyForm() {
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating company");

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name }])
        .select()
        .single();

      if (companyError) throw companyError;

      // Link user to company
      const { error: linkError } = await supabase
        .from('company_users')
        .insert([{
          user_id: user.id,
          company_id: company.id,
          role: 'admin'
        }]);

      if (linkError) throw linkError;

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
          />
        </div>

        <Button type="submit" className="w-full">
          Create Company
        </Button>
      </form>
    </Card>
  );
}