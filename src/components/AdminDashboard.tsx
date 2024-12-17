import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export function AdminDashboard() {
  const { toast } = useToast();
  const { data: pendingCompanies, refetch } = useQuery({
    queryKey: ['pendingCompanies'],
    queryFn: async () => {
      console.log("Fetching pending companies");
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('pending_approval', true)
        .eq('is_approved', false);

      if (error) {
        console.error('Error fetching pending companies:', error);
        throw error;
      }

      console.log("Pending companies:", data);
      return data;
    },
  });

  const handleApproval = async (companyId: string, approve: boolean) => {
    console.log(`${approve ? 'Approving' : 'Rejecting'} company ${companyId}`);
    
    const { error } = await supabase
      .from('companies')
      .update({ 
        is_approved: approve,
        pending_approval: false 
      })
      .eq('id', companyId);

    if (error) {
      console.error('Error updating company status:', error);
      toast({
        title: "Error",
        description: "Failed to update company status.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Company ${approve ? 'approved' : 'rejected'} successfully.`,
    });

    refetch();
  };

  if (!pendingCompanies?.length) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">No pending companies to approve.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Companies</h2>
      {pendingCompanies.map((company) => (
        <Card key={company.id} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm text-gray-500">Created at: {new Date(company.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApproval(company.id, true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleApproval(company.id, false)}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}