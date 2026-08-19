// Supabase Configuration and Client Setup
const SUPABASE_CONFIG = {
  url: 'https://wsmbuwkdtscihdolcfql.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzbwj1d2tkdHNjaWhkb2xjZnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NDMyMzIsImV4cCI6MjA1MjAxOTIzMn0.SaoPTIdO0q0P5kNtok3GVw_cIXKScEV'
};

// Initialize Supabase client
let supabaseClient = null;

// Function to initialize Supabase
const initSupabase = () => {
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please include the Supabase CDN script.');
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
    console.log('✅ Supabase client initialized');
  }
  
  return supabaseClient;
};

// Get Supabase client instance
const getSupabase = () => {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
};

// Export for use in other scripts
window.SupabaseClient = {
  init: initSupabase,
  get: getSupabase,
  config: SUPABASE_CONFIG
};

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}
