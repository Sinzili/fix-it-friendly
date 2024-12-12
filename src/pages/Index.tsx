import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { BarChart, Calendar, Users } from "lucide-react";

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
            <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">Project {i}</p>
                    <p className="text-sm text-gray-500">Client Name {i}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
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