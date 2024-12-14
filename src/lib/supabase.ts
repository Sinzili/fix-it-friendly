import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mtontlronxidpzccmngq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b250bHJvbnhpZHB6Y2NtbmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxODYwMjcsImV4cCI6MjA0OTc2MjAyN30.vzUGYcW1sagVKiFcIGlPk7asBbbifOwIEpvLwIOc2oA";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required.');
  throw new Error('Supabase credentials are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);