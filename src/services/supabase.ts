import { supabase } from '@/lib/supabase';

export interface ServiceCall {
  id?: string;
  customer_name: string;
  phone_number: string;
  address: string;
  date: Date;
  technician_id: string;
  technician_name: string;
  problem: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at?: Date;
}

export const addServiceCall = async (serviceCall: Omit<ServiceCall, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('service_calls')
      .insert([{
        ...serviceCall,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    console.log("Service call logged with ID: ", data.id);
    return data.id;
  } catch (error) {
    console.error("Error adding service call: ", error);
    throw error;
  }
};