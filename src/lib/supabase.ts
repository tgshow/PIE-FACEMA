import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sbrrajiaatbvltmwwvtk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicnJhamlhYXRidmx0bXd3dnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDgzMDMsImV4cCI6MjA3ODYyNDMwM30.9CYaMqr0-R6IJOUvq26yTUuTa5TWphRb1jmA1lS0NZs"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);