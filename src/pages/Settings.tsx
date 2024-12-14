import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Bell, Lock, User, Building } from "lucide-react";

const settingsCategories = [
  {
    title: "Profile Settings",
    icon: User,
    description: "Update your personal information and preferences",
  },
  {
    title: "Security",
    icon: Lock,
    description: "Manage your password and security settings",
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Configure your notification preferences",
  },
  {
    title: "Company Details",
    icon: Building,
    description: "Update your company information",
  },
];

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account and application preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {settingsCategories.map((category) => (
            <Card 
              key={category.title} 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;