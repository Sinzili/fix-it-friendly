import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ServiceCallDetails } from "@/components/ServiceCallDetails";

interface Technician {
  id: string;
  name: string;
  specialty: string;
  status: string;
  email: string;
}

interface ServiceCall {
  id: string;
  customer_name: string;
  address: string;
  scheduled_date: string;
  description: string;
  status: string;
  phone_number: string;
}

const Technicians = () => {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [selectedServiceCall, setSelectedServiceCall] = useState<string | null>(null);

  const { data: technicians, isLoading } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technicians')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: serviceCalls } = useQuery({
    queryKey: ['serviceCalls', selectedTechnician?.id],
    queryFn: async () => {
      if (!selectedTechnician) return null;
      const { data, error } = await supabase
        .from('service_calls')
        .select(`
          *,
          service_call_details(*),
          service_call_photos(*)
        `)
        .eq('technician_id', selectedTechnician.id);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTechnician,
  });

  const filterServiceCalls = (status: string) => {
    return serviceCalls?.filter(call => call.status === status) || [];
  };

  const ServiceCallCard = ({ call }: { call: ServiceCall }) => (
    <Card className="p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedServiceCall(call.id)}>
      <div className="space-y-2">
        <div className="flex justify-between">
          <h4 className="font-semibold">{call.customer_name}</h4>
          <span className="text-sm text-gray-500">
            {format(new Date(call.scheduled_date), 'MMM dd, yyyy HH:mm')}
          </span>
        </div>
        <p className="text-sm text-gray-600">{call.address}</p>
        <p className="text-sm">{call.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{call.phone_number}</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            call.status === 'completed' ? 'bg-green-100 text-green-800' :
            call.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {call.status}
          </span>
        </div>
      </div>
    </Card>
  );

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
        <div>
          <h1 className="text-3xl font-bold">Technicians</h1>
          <p className="text-gray-500 mt-2">Manage your technician team</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technicians?.map((tech) => (
            <Card 
              key={tech.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedTechnician(tech)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{tech.name}</h3>
                  <p className="text-sm text-gray-500">{tech.specialty}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`text-sm font-medium ${
                    tech.status === "Available" ? "text-green-600" : "text-blue-600"
                  }`}>
                    {tech.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium">{tech.email}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedTechnician} onOpenChange={() => setSelectedTechnician(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedTechnician?.name}'s Service Calls</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="in_progress" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="pending">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[60vh] mt-4">
                <TabsContent value="in_progress">
                  {filterServiceCalls('in_progress').map(call => (
                    <ServiceCallCard key={call.id} call={call} />
                  ))}
                </TabsContent>

                <TabsContent value="pending">
                  {filterServiceCalls('pending').map(call => (
                    <ServiceCallCard key={call.id} call={call} />
                  ))}
                </TabsContent>

                <TabsContent value="completed">
                  {filterServiceCalls('completed').map(call => (
                    <ServiceCallCard key={call.id} call={call} />
                  ))}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedServiceCall} onOpenChange={() => setSelectedServiceCall(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Service Call Details</DialogTitle>
            </DialogHeader>
            {selectedServiceCall && (
              <ServiceCallDetails
                serviceCallId={selectedServiceCall}
                onClose={() => setSelectedServiceCall(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Technicians;