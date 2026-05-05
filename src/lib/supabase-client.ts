import { createClient } from "@supabase/supabase-js";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Lazy-load Supabase client only when needed
 * This prevents loading the entire Supabase library on initial page load
 */
export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
};

/**
 * Optional: Export a hook for React components
 */
export const useSupabaseClient = () => {
  return getSupabaseClient();
};