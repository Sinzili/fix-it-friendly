import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTechnicianForm } from "@/components/AddTechnicianForm";
import { AddCustomerForm } from "@/components/AddCustomerForm";

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your application settings</p>
        </div>

        <Tabs defaultValue="technicians" className="space-y-4">
          <TabsList>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="technicians" className="space-y-4">
            <AddTechnicianForm />
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <AddCustomerForm />
          </TabsContent>

          <TabsContent value="company">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Company Settings</h3>
              <p className="text-gray-500">Company settings coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <p className="text-gray-500">Notification settings coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;