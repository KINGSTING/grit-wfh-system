// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://segjuaenosiiddvpfdnm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZ2p1YWVub3NpaWRkdnBmZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0OTMzNjAsImV4cCI6MjA5OTA2OTM2MH0.Jhe4ULcsR6luWbG3JFE5P5pNPjEdLTxyZvFwln_xgvc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);