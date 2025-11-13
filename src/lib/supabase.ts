import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://etopgnnifklbhxuvznps.supabase.co"; // 🔁 Substitua pelo seu
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0b3Bnbm5pZmtsYmh4dXZ6bnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Njk0MDQsImV4cCI6MjA3ODU0NTQwNH0.2pgZSbReKBZHYfPUXrbF8hpAMcFGMcbnTMYKKnCEdbM"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);