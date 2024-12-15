import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { UserPlus } from "lucide-react";

const specialties = [
  "HVAC",
  "Electrical",
  "Plumbing",
  "General Maintenance",
  "Carpentry",
  "Painting",
];

export function AddTechnicianForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting technician data to Supabase");

    try {
      const { data, error } = await supabase
        .from('technicians')
        .insert([
          {
            name,
            email,
            phone,
            specialty,
            status: 'active'
          }
        ]);

      if (error) {
        console.error('Error adding technician:', error);
        toast({
          title: "Error",
          description: "Failed to add technician. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Technician added successfully:', data);
      toast({
        title: "Success",
        description: "Technician has been added successfully.",
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setSpecialty("");
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
        <h3 className="text-lg font-semibold">Add New Technician</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              placeholder="Enter technician name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email" 
              placeholder="Enter email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Specialty</label>
            <Select value={specialty} onValueChange={setSpecialty} required>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Add Technician
        </Button>
      </form>
    </Card>
  );
}