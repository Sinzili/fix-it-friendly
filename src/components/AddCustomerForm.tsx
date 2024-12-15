import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import { MapPin } from "lucide-react";

export function AddCustomerForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { toast } = useToast();

  const handleMapClick = async () => {
    // For this implementation, we'll use the browser's geolocation API
    // In a production environment, you might want to use a proper map component
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          // Here you would typically reverse geocode to get the address
          toast({
            title: "Location captured",
            description: "Location coordinates have been saved.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Failed to get location. Please try again.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting customer data to Supabase");

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            name,
            phone,
            address,
            latitude,
            longitude
          }
        ]);

      if (error) {
        console.error('Error adding customer:', error);
        toast({
          title: "Error",
          description: "Failed to add customer. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Customer added successfully:', data);
      toast({
        title: "Success",
        description: "Customer has been added successfully.",
      });

      // Reset form
      setName("");
      setPhone("");
      setAddress("");
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Add New Customer</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              placeholder="Enter customer name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input 
              type="tel" 
              placeholder="Enter phone number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleMapClick}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Get Location
              </Button>
            </div>
          </div>

          {(latitude && longitude) && (
            <div className="md:col-span-2 p-2 bg-muted rounded text-sm">
              Location captured: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Customer
        </Button>
      </form>
    </Card>
  );
}