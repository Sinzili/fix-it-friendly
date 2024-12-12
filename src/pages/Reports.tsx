import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { BarChart as BarChartIcon, LineChart, PieChart } from "lucide-react";

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500 mt-2">View performance metrics and analytics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChartIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Performance Report</h3>
                <p className="text-sm text-gray-500">Job completion rates</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Efficiency Metrics</h3>
                <p className="text-sm text-gray-500">Time and resource usage</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Revenue Analysis</h3>
                <p className="text-sm text-gray-500">Financial performance</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;