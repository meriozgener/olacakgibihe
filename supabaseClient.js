
// supabaseClient.js
const SUPABASE_URL = 'https://rizenojzaklraiqlgxpk.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpemVub2p6YWtscmFpcWxneHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzUyNzcsImV4cCI6MjA2ODQ1MTI3N30.sxmHSPCibp0W16xT0riMAhAAceXPxIwuDBFtfGeN4ms'

// Initialize Supabase client with proper error handling
function initializeSupabase() {
  try {
    // Eğer zaten initialize edilmişse tekrar etme
    if (window.supabaseClient) {
      console.log('Supabase client already initialized');
      return true;
    }

    // Supabase kütüphanesinin yüklenmesini bekle
    if (typeof window.supabase === 'undefined') {
      console.error('Supabase library not loaded');
      setTimeout(initializeSupabase, 1000); // 1 saniye sonra tekrar dene
      return false;
    }

    // createClient fonksiyonunu al
    let createClient;
    if (window.supabase.createClient) {
      createClient = window.supabase.createClient;
    } else if (window.supabase.default && window.supabase.default.createClient) {
      createClient = window.supabase.default.createClient;
    } else {
      console.error('createClient is not available');
      setTimeout(initializeSupabase, 1000); // 1 saniye sonra tekrar dene
      return false;
    }

    // Client'ı oluştur (sadece bir kez)
    window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log('Supabase client initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    setTimeout(initializeSupabase, 1000); // Hata durumunda tekrar dene
    return false;
  }
}

// Try to initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for Supabase library to load
  setTimeout(initializeSupabase, 500);
});

// Also try immediate initialization
if (document.readyState === 'loading') {
  // Document is still loading
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeSupabase, 500);
  });
} else {
  // Document is already loaded
  setTimeout(initializeSupabase, 500);
}

// Export initialization function
window.initializeSupabase = initializeSupabase;
