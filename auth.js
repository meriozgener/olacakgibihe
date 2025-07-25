
// auth.js

// Giriş fonksiyonu
async function girisYap(email, sifre, kullaniciTuru) {
  try {
    // Supabase client'ın hazır olup olmadığını kontrol et
    if (!window.supabase || !window.supabaseClient) {
      alert("Sistem yükleniyor, lütfen birkaç saniye bekleyin ve tekrar deneyin...");
      // Try to reinitialize
      if (window.initializeSupabase) {
        window.initializeSupabase();
      }
      return false;
    }

    const { data, error } = await window.supabase.auth.signInWithPassword({
      email: email,
      password: sifre
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        alert("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
      } else {
        alert("Giriş başarısız: " + error.message);
      }
      return false;
    } 
    
    alert("Giriş başarılı! Yönlendiriliyorsunuz...");
    
    // Kullanıcı türüne göre yönlendirme
    setTimeout(() => {
      if (kullaniciTuru === 'teacher') {
        window.location.href = "teacher-dashboard.html";
      } else {
        window.location.href = "student-dashboard.html";
      }
    }, 1000);
    
    return true;
  } catch (err) {
    console.error('Giriş hatası:', err);
    alert("Bir hata oluştu. Lütfen sayfayı yenileyin ve tekrar deneyin.");
    return false;
  }
}

// Kayıt fonksiyonu
async function kayitOl(isim, email, sifre, kullaniciTuru) {
  try {
    // Supabase client'ın hazır olup olmadığını kontrol et
    if (!window.supabase || !window.supabaseClient) {
      alert("Sistem yükleniyor, lütfen birkaç saniye bekleyin ve tekrar deneyin...");
      // Try to reinitialize
      if (window.initializeSupabase) {
        window.initializeSupabase();
      }
      return false;
    }

    const { data, error } = await window.supabase.auth.signUp({
      email: email,
      password: sifre,
      options: {
        data: {
          full_name: isim,
          user_type: kullaniciTuru
        }
      }
    })

    if (error) {
      if (error.message.includes('User already registered')) {
        alert("Bu e-posta adresi ile zaten kayıt olunmuş. Giriş yapmayı deneyin.");
      } else if (error.message.includes('Password should be at least')) {
        alert("Şifre en az 6 karakter olmalıdır.");
      } else {
        alert("Kayıt başarısız: " + error.message);
      }
      return false;
    } else {
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      return true;
    }
  } catch (err) {
    console.error('Kayıt hatası:', err);
    alert("Bir hata oluştu. Lütfen sayfayı yenileyin ve tekrar deneyin.");
    return false;
  }
}

// Çıkış fonksiyonu
async function cikisYap() {
  try {
    if (!window.supabase) {
      window.location.href = "index.html";
      return;
    }
    
    const { error } = await window.supabase.auth.signOut();
    if (error) {
      console.error('Çıkış hatası:', error);
    }
    window.location.href = "index.html";
  } catch (err) {
    console.error('Çıkış hatası:', err);
    window.location.href = "index.html";
  }
}

// Kullanıcı oturum kontrolü
async function oturumKontrol() {
  try {
    if (!window.supabase) {
      return null;
    }
    
    const { data: { session } } = await window.supabase.auth.getSession();
    return session;
  } catch (err) {
    console.error('Oturum kontrol hatası:', err);
    return null;
  }
}

// Export functions for global access
window.girisYap = girisYap;
window.kayitOl = kayitOl;
window.cikisYap = cikisYap;
window.oturumKontrol = oturumKontrol;
