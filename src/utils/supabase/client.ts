import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Singleton Supabase client to avoid multiple instances
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      // Automatically detect the redirect and parse auth tokens
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);