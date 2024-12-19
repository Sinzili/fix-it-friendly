import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import SignatureCanvas from 'react-signature-canvas';
import { StarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

interface ServiceCallDetailsProps {
  serviceCallId: string;
  onClose: () => void;
}

export function ServiceCallDetails({ serviceCallId, onClose }: ServiceCallDetailsProps) {
  const [progressNotes, setProgressNotes] = useState("");
  const [partsUsed, setPartsUsed] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [customerRating, setCustomerRating] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [signaturePad, setSignaturePad] = useState<SignatureCanvas | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPhotos(Array.from(files));
    }
  };

  const uploadPhotos = async () => {
    const uploadedUrls = [];
    
    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${serviceCallId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job_photos')
        .upload(fileName, photo);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('job_photos')
        .getPublicUrl(fileName);

      if (urlData) {
        const { error: photoError } = await supabase
          .from('service_call_photos')
          .insert({
            service_call_id: serviceCallId,
            photo_url: urlData.publicUrl
          });

        if (photoError) {
          console.error('Error saving photo record:', photoError);
        } else {
          uploadedUrls.push(urlData.publicUrl);
        }
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting service call details');

    try {
      // Upload photos first
      await uploadPhotos();

      // Save signature if exists
      let signatureUrl = null;
      if (signaturePad && !signaturePad.isEmpty()) {
        const signatureData = signaturePad.toDataURL();
        signatureUrl = signatureData;
      }

      // Update service call status
      const { error: statusError } = await supabase
        .from('service_calls')
        .update({ status })
        .eq('id', serviceCallId);

      if (statusError) {
        throw statusError;
      }

      // Save service call details
      const { error: detailsError } = await supabase
        .from('service_call_details')
        .insert({
          service_call_id: serviceCallId,
          progress_notes: progressNotes,
          parts_used: partsUsed.split(',').map(part => part.trim()),
          completion_notes: completionNotes,
          customer_signature: signatureUrl,
          customer_rating: customerRating
        });

      if (detailsError) {
        throw detailsError;
      }

      toast({
        title: "Success",
        description: "Service call details have been saved successfully.",
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });

      onClose();
    } catch (error) {
      console.error('Error saving service call details:', error);
      toast({
        title: "Error",
        description: "Failed to save service call details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Progress Notes</label>
            <Textarea
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              placeholder="Describe the progress of the work..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Parts Used</label>
            <Input
              value={partsUsed}
              onChange={(e) => setPartsUsed(e.target.value)}
              placeholder="Enter parts used, separated by commas"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Completion Notes</label>
            <Textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Describe the completed work..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Photos</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setCustomerRating(rating)}
                  className={`p-1 ${customerRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <StarIcon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Signature</label>
            <div className="border rounded-md p-2 bg-white">
              <SignatureCanvas
                ref={(ref) => setSignaturePad(ref)}
                canvasProps={{
                  className: "signature-canvas w-full h-40"
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => signaturePad?.clear()}
            >
              Clear Signature
            </Button>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}