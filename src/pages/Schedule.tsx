import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { ServiceCall } from "@/services/supabase";
import { format } from "date-fns";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: serviceCalls, isLoading } = useQuery({
    queryKey: ['serviceCalls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_calls')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as ServiceCall[];
    }
  });

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
            {isLoading ? (
              <p>Loading appointments...</p>
            ) : (
              <div className="space-y-4">
                {serviceCalls?.map((call) => (
                  <div key={call.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{call.customer_name}</p>
                      <p className="text-sm text-gray-500">Technician: {call.technician_name}</p>
                      <p className="text-sm text-gray-500">Date: {format(new Date(call.date), 'PPP')}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {call.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Schedule;