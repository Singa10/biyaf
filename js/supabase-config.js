// Supabase Configuration and Client Setup
const SUPABASE_CONFIG = {
  url: 'https://wsmbuwkdtscihdolcfql.supabase.co',
  key: 'sb_publishable_t8zEgoynP0a-XZw9clCz2Q_4LN0CIcx'
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
