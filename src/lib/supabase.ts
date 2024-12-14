import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://f5c670ac-2683-4cc0-ac76-6c8cd96d047b.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImY1YzY3MGFjLTI2ODMtNGNjMC1hYzc2LTZjOGNkOTZkMDQ3YiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEwMjc0NjI3LCJleHAiOjIwMjU4NTA2Mjd9.Rl0uWxoIrLpUdkKgTXRYEwgj4GKDkB0-Yw-g2OfYQvs';

export const supabase = createClient(supabaseUrl, supabaseKey);