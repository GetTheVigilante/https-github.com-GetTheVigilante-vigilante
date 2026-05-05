import { createClient } from '@supabase/supabase-js';

// Initialize database client
// In production, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as environment variables
// in your hosting platform (Vercel, Netlify, etc.)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dbzyvxnlqjbuygtvhizq.databasepad.com';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImU4Y2UyZWZiLTI1YzQtNDk2OS1iOGI4LWY0ZTFiZmNjYzU1OCJ9.eyJwcm9qZWN0SWQiOiJkYnp5dnhubHFqYnV5Z3R2aGl6cSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc0ODM3MTIzLCJleHAiOjIwOTAxOTcxMjMsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.5K-XHDm4WH1-ZEhp1a2saYmV7vhgfjKS-em8Ln0TxJE';
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
