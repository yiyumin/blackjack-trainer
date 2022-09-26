import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey)
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export { supabaseClient };
