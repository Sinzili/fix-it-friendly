import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { BarChart, Calendar, Users } from "lucide-react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { getDocs } from "firebase/firestore";
import type { ServiceCall } from "@/services/firebase";
import { format } from "date-fns";

const stats = [
  {
    title: "Active Projects",
    value: "12",
    icon: BarChart,
    change: "+2.5%",
    changeType: "positive",
  },
  {
    title: "Technicians",
    value: "24",
    icon: Users,
    change: "+3.2%",
    changeType: "positive",
  },
  {
    title: "Scheduled Jobs",
    value: "89",
    icon: Calendar,
    change: "+12.5%",
    changeType: "positive",
  },
];

const Index = () => {
  const { data: recentCalls, isLoading } = useQuery({
    queryKey: ['recentServiceCalls'],
    queryFn: async () => {
      const q = query(
        collection(db, "serviceCalls"), 
        orderBy("createdAt", "desc"), 
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (ServiceCall & { id: string })[];
    }
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome to Eagle Vision Technician Management</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Service Calls</h3>
            {isLoading ? (
              <p>Loading service calls...</p>
            ) : (
              <div className="space-y-4">
                {recentCalls?.map((call) => (
                  <div key={call.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{call.customerName}</p>
                      <p className="text-sm text-gray-500">Technician: {call.technicianName}</p>
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

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">Task {i}</p>
                    <p className="text-sm text-gray-500">Technician {i}</p>
                  </div>
                  <span className="text-sm text-gray-500">In 2 days</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;