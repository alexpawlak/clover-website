import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
if (!anonKey) throw new Error('Missing SUPABASE_ANON_KEY');

// Admin client — uses service role key, bypasses RLS. Server-side only.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Auth client — uses anon key, for verifying user sessions.
export const supabaseAuth = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false },
});
