import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ServiceCall {
  customerName: string;
  phoneNumber: string;
  address: string;
  date: Date;
  technicianId: string;
  technicianName: string;
  problem: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export const addServiceCall = async (serviceCall: Omit<ServiceCall, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "serviceCalls"), {
      ...serviceCall,
      createdAt: new Date(),
    });
    console.log("Service call logged with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding service call: ", error);
    throw error;
  }
};