import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

const technicians = [
  {
    id: 1,
    name: "John Doe",
    specialty: "HVAC",
    status: "Available",
    jobs_completed: 145,
  },
  {
    id: 2,
    name: "Jane Smith",
    specialty: "Electrical",
    status: "On Job",
    jobs_completed: 132,
  },
  {
    id: 3,
    name: "Mike Johnson",
    specialty: "Plumbing",
    status: "Available",
    jobs_completed: 98,
  },
];

const Technicians = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Technicians</h1>
          <p className="text-gray-500 mt-2">Manage your technician team</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => (
            <Card key={tech.id} className="p-6">
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
                  <span className="text-sm text-gray-500">Jobs Completed</span>
                  <span className="text-sm font-medium">{tech.jobs_completed}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Technicians;