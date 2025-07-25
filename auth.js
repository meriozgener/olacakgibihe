
// auth.js - Authentication functions

async function girisYap(email, password, userType) {
  try {
    // Supabase client kontrolü
    if (!window.supabaseClient) {
      console.error('Supabase client not initialized');
      alert('Bağlantı hatası. Sayfayı yenileyin.');
      return false;
    }

    console.log('Attempting login with:', { email, userType });

    // Supabase ile giriş yap
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Giriş hatası: ';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.\n\nEğer hesabınızı onaylamadıysanız, e-posta kutunuzu kontrol edin.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'E-posta adresiniz henüz onaylanmamış. Lütfen e-posta kutunuzu kontrol edin.';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
      return false;
    }

    if (data.user) {
      console.log('Login successful:', data.user);
      
      // Kullanıcı tipine göre yönlendirme
      if (userType === 'student') {
        console.log('Redirecting to student dashboard');
        window.location.href = 'student-dashboard.html';
      } else if (userType === 'teacher') {
        console.log('Redirecting to teacher dashboard');
        window.location.href = 'teacher-dashboard.html';
      }
      
      return true;
    }

    return false;
  } catch (error) {
    console.error('Login error:', error);
    alert('Giriş sırasında bir hata oluştu');
    return false;
  }
}

async function kayitOl(name, email, password, userType) {
  try {
    // Supabase client kontrolü
    if (!window.supabaseClient) {
      console.error('Supabase client not initialized');
      alert('Bağlantı hatası. Sayfayı yenileyin.');
      return false;
    }

    console.log('Attempting registration with:', { name, email, userType });

    // Supabase ile kayıt ol
    const { data, error } = await window.supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
          user_type: userType
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      alert('Kayıt hatası: ' + error.message);
      return false;
    }

    if (data.user) {
      console.log('Registration successful:', data.user);
      alert('Kayıt başarılı! E-posta adresinizi kontrol ederek hesabınızı onaylayın.');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Registration error:', error);
    alert('Kayıt sırasında bir hata oluştu');
    return false;
  }
}

async function cikisYap() {
  try {
    if (!window.supabaseClient) {
      console.error('Supabase client not initialized');
      window.location.href = 'index.html';
      return;
    }

    const { error } = await window.supabaseClient.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }
    
    // Ana sayfaya yönlendir
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = 'index.html';
  }
}

// Kullanıcının giriş durumunu kontrol et
async function kullaniciDurumKontrol() {
  try {
    if (!window.supabaseClient) {
      console.log('Supabase client not available for user check');
      return null;
    }

    // Önce session kontrolü yap
    const { data: { session }, error: sessionError } = await window.supabaseClient.auth.getSession();
    
    if (sessionError) {
      console.error('Session check error:', sessionError);
      return null;
    }

    if (session && session.user) {
      console.log('Valid session found:', session.user.email);
      return session.user;
    }

    // Session yoksa user bilgisini kontrol et
    const { data: { user }, error: userError } = await window.supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('User check error:', userError);
      return null;
    }

    return user;
  } catch (error) {
    console.error('User check error:', error);
    return null;
  }
}

// Dashboard kullanıcı kontrolü için retry mekanizması
async function checkDashboardAuth(retryCount = 0) {
  const maxRetries = 3;
  
  try {
    // Supabase client'ın hazır olmasını bekle
    if (!window.supabaseClient && retryCount < maxRetries) {
      console.log(`Waiting for Supabase client... (attempt ${retryCount + 1})`);
      setTimeout(() => checkDashboardAuth(retryCount + 1), 1000);
      return;
    }

    const user = await kullaniciDurumKontrol();
    if (!user) {
      if (retryCount < maxRetries) {
        console.log(`Auth check failed, retrying... (attempt ${retryCount + 1})`);
        setTimeout(() => checkDashboardAuth(retryCount + 1), 1000);
        return;
      }
      console.log('User not authenticated after retries, redirecting to login');
      window.location.href = 'index.html';
    } else {
      console.log('User authenticated successfully');
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
    if (retryCount < maxRetries) {
      setTimeout(() => checkDashboardAuth(retryCount + 1), 1000);
    } else {
      window.location.href = 'index.html';
    }
  }
}

// Sayfa yüklendiğinde kullanıcı durumunu kontrol et
document.addEventListener('DOMContentLoaded', function() {
  // Eğer dashboard sayfalarındaysak kullanıcı kontrolü yap
  const currentPage = window.location.pathname;
  if (currentPage.includes('dashboard')) {
    // Biraz bekle ve sonra kontrol et
    setTimeout(() => checkDashboardAuth(), 1500);
  }
});

// Supabase auth state değişikliklerini dinle - initialization'ı bekle
function setupAuthStateListener() {
  if (typeof window !== 'undefined' && window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      const currentPage = window.location.pathname;
      
      if (event === 'SIGNED_OUT' && currentPage.includes('dashboard')) {
        // Kullanıcı çıkış yaptıysa ana sayfaya yönlendir
        window.location.href = 'index.html';
      }
    });
  } else {
    // Supabase client henüz hazır değilse biraz bekle
    setTimeout(setupAuthStateListener, 500);
  }
}

// Auth listener'ı kur
setTimeout(setupAuthStateListener, 1000);

// Şifre sıfırlama fonksiyonu
async function resetPassword() {
  const email = prompt('Şifre sıfırlama linkinin gönderileceği e-posta adresinizi girin:');
  
  if (!email) return;
  
  try {
    if (!window.supabaseClient) {
      alert('Bağlantı hatası. Sayfayı yenileyin.');
      return;
    }

    const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/index.html'
    });

    if (error) {
      console.error('Password reset error:', error);
      alert('Şifre sıfırlama hatası: ' + error.message);
    } else {
      alert('Şifre sıfırlama linki e-posta adresinize gönderildi!');
    }
  } catch (error) {
    console.error('Password reset error:', error);
    alert('Şifre sıfırlama sırasında bir hata oluştu');
  }
}

// Make function globally available
window.resetPassword = resetPassword;
