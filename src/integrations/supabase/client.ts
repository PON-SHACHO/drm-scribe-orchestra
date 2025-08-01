// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://geksgxoznpjrsqpzmyhz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla3NneG96bnBqcnNxcHpteWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTgyMTMsImV4cCI6MjA2OTQzNDIxM30.ddL3273Gk7JhC-qBsj0hyPpcExEfJxf_XxU4stKXgG8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});