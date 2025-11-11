import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qalordzdxogsytnemmwv.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbG9yZHpkeG9nc3l0bmVtbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjUzOTUsImV4cCI6MjA3Nzk0MTM5NX0.mtuseFSrl3FS5hjPEHpiM1E10AEAZbHlY9o8pzGQprU' 
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase