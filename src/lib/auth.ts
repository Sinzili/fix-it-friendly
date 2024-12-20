import { supabase } from "@/lib/supabase";

export const signInWithEmail = async (email: string, password: string) => {
  console.log("Attempting to sign in with email...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Sign in error:", error);
    throw error;
  }
  
  console.log("Sign in successful:", data);
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  console.log("Attempting to sign up with email...");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  
  if (error) {
    console.error("Sign up error:", error);
    throw error;
  }
  
  console.log("Sign up successful:", data);
  return data;
};