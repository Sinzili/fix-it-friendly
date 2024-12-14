import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://f5c670ac-2683-4cc0-ac76-6c8cd96d047b.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);