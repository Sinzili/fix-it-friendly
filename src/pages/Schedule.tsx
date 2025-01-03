import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiceCallDetails } from "@/components/ServiceCallDetails";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedServiceCall, setSelectedServiceCall] = useState<string | null>(null);

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      console.log('Fetching service calls');
      const { data, error } = await supabase
        .from('service_calls')
        .select(`
          *,
          service_call_details(*),
          service_call_photos(*)
        `)
        .gte('scheduled_date', new Date().toISOString())
        .order('scheduled_date', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('Fetched appointments:', data);
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-gray-500 mt-2">Manage technician appointments and jobs</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between border-b pb-4 last:border-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => setSelectedServiceCall(appointment.id)}
                >
                  <div>
                    <p className="font-medium">{appointment.customer_name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(appointment.scheduled_date), 'MMM dd, yyyy HH:mm')}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.address}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

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

export default Schedule;