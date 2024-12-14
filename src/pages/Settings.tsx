import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Bell, Lock, User, Building } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    company_name: "",
    notification_preferences: {
      email: true,
      push: true,
      sms: true
    },
    security_settings: {
      two_factor: false,
      password_expiry_days: 90
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create initial settings if none exist
        const { error: insertError } = await supabase
          .from('settings')
          .insert([
            {
              user_id: user.id,
              ...settings
            }
          ]);

        if (insertError) {
          console.error('Error creating initial settings:', insertError);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('settings')
        .update(settings)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (type: keyof typeof settings.notification_preferences) => {
    setSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [type]: !prev.notification_preferences[type]
      }
    }));
  };

  const handleSecurityChange = (type: keyof typeof settings.security_settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      security_settings: {
        ...prev.security_settings,
        [type]: value
      }
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account and application preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Company Details */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Company Details</h3>
                <p className="text-sm text-gray-500">Update your company information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={settings.company_name}
                  onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Notification Settings</h3>
                <p className="text-sm text-gray-500">Configure your notification preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={settings.notification_preferences.email}
                  onCheckedChange={() => handleNotificationChange('email')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push Notifications</Label>
                <Switch
                  checked={settings.notification_preferences.push}
                  onCheckedChange={() => handleNotificationChange('push')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch
                  checked={settings.notification_preferences.sms}
                  onCheckedChange={() => handleNotificationChange('sms')}
                />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Security Settings</h3>
                <p className="text-sm text-gray-500">Manage your security preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Two-Factor Authentication</Label>
                <Switch
                  checked={settings.security_settings.two_factor}
                  onCheckedChange={(checked) => handleSecurityChange('two_factor', checked)}
                />
              </div>
              <div>
                <Label>Password Expiry (days)</Label>
                <Input
                  type="number"
                  value={settings.security_settings.password_expiry_days}
                  onChange={(e) => handleSecurityChange('password_expiry_days', parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>
            </div>
          </Card>
        </div>

        <Button 
          onClick={updateSettings} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Layout>
  );
};

export default Settings;