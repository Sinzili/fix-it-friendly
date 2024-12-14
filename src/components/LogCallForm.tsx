import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const technicians = [
  { id: "1", name: "John Doe", specialty: "HVAC" },
  { id: "2", name: "Jane Smith", specialty: "Electrical" },
  { id: "3", name: "Mike Johnson", specialty: "Plumbing" },
];

export function LogCallForm() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTech, setSelectedTech] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data to Supabase");

    try {
      const { data, error } = await supabase
        .from('service_calls')
        .insert([
          {
            customer_name: customerName,
            phone_number: phoneNumber,
            address: address,
            scheduled_date: date.toISOString(),
            technician_id: selectedTech,
            description: description,
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Error submitting service call:', error);
        toast({
          title: "Error",
          description: "Failed to log service call. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Service call logged successfully:', data);
      toast({
        title: "Success",
        description: "Service call has been logged successfully.",
      });

      // Reset form
      setCustomerName("");
      setPhoneNumber("");
      setAddress("");
      setDate(new Date());
      setSelectedTech("");
      setDescription("");
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
      <h3 className="text-lg font-semibold mb-4">Log New Service Call</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input 
                className="pl-9" 
                placeholder="Enter customer name" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input 
                className="pl-9" 
                type="tel" 
                placeholder="Enter phone number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input 
                className="pl-9" 
                placeholder="Enter address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assign Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assign Technician</label>
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger>
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name} - {tech.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Problem Description</label>
          <Textarea
            placeholder="Describe the problem that needs to be solved"
            className="min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Log Service Call
        </Button>
      </form>
    </Card>
  );
}