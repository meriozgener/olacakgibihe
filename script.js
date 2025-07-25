// Sample literature data (700 eserlik veritabanı simülasyonu)
const literatureWorks = [
  {
    name: "Tutunamayanlar",
    author: "Oğuz Atay",
    summary: "Modern Türk edebiyatının başyapıtlarından biri olan bu roman, birey ve toplum arasındaki uyumsuzluğu ele alır. Selim Işık karakteri üzerinden varoluşsal sorunları irdeler."
  },
  {
    name: "Saatleri Ayarlama Enstitüsü",
    author: "Ahmet Hamdi Tanpınar",
    summary: "Doğu ve Batı kültürü arasında kalmış bir toplumun modernleşme sürecini eleştirel bir gözle inceleyen allegorik roman."
  },
  {
    name: "Beyaz Kale",
    author: "Orhan Pamuk",
    summary: "17. yüzyıl Osmanlı İmparatorluğu'nda geçen, kimlik değişimi ve kültürel karşılaşmaları konu alan postmodern roman."
  },
  {
    name: "Serenad",
    author: "Zülfü Livaneli",
    summary: "Aşk, müzik ve savaşın yıkıcı etkilerini harmanlayan, iki farklı dönemde geçen duygusal bir roman."
  },
  {
    name: "Aşk-ı Memnu",
    author: "Halit Ziya Uşaklıgıl",
    summary: "Türk edebiyatının klasik aşk romanlarından biri. Yasak aşkın trajik sonuçlarını Behlül ve Bihter üzerinden anlatır."
  },
  {
    name: "Sinekli Bakkal",
    author: "Halide Edib Adıvar",
    summary: "Milli Mücadele döneminin toplumsal değişimini sıradan insanların gözünden anlatan realist roman."
  },
  {
    name: "Huzur",
    author: "Ahmet Hamdi Tanpınar",
    summary: "İstanbul'un son dönem sosyal yaşamını ve entellektüel ortamını yansıtan, zaman ve mekân algısını sorgulayan roman."
  },
  {
    name: "Yaban",
    author: "Yakup Kadri Karaosmanoğlu",
    summary: "Kurtuluş Savaşı sonrası Anadolu köylerindeki sosyal ve kültürel durumu eleştirel bir bakışla ele alan roman."
  }
];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Modal Functions
function showLoginModal() {
  loginModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function showRegisterModal() {
  registerModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';
}

function switchToRegister() {
  closeModal('loginModal');
  showRegisterModal();
}

function switchToLogin() {
  closeModal('registerModal');
  showLoginModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === loginModal || event.target === registerModal) {
    closeModal('loginModal');
    closeModal('registerModal');
  }
}

// Smooth scroll to features
function scrollToFeatures() {
  document.getElementById('features').scrollIntoView({ 
    behavior: 'smooth' 
  });
}

// Daily Literature Function
function displayDailyLiterature() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const selectedWork = literatureWorks[dayOfYear % literatureWorks.length];

  const literatureCard = document.getElementById('dailyLiterature');

  setTimeout(() => {
    literatureCard.innerHTML = `
      <div class="literature-content">
        <h3>${selectedWork.name}</h3>
        <div class="literature-meta">
          <span><i class="fas fa-user"></i> <strong>Yazar:</strong> ${selectedWork.author}</span>
          <span><i class="fas fa-calendar"></i> <strong>Günün Eseri</strong></span>
        </div>
        <div class="literature-summary">
          <p>${selectedWork.summary}</p>
        </div>
      </div>
    `;
  }, 1500);
}

// Form Handlers
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const userType = document.getElementById('userType').value;

  console.log('Login attempt:', { email, userType });

  // Supabase ile giriş yap
  const success = await girisYap(email, password, userType);

  if (success) {
    closeModal('loginModal');
  }
});

registerForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const userType = document.getElementById('registerUserType').value;

  console.log('Registration attempt:', { name, email, userType });

  // Supabase ile kayıt ol
  const success = await kayitOl(name, email, password, userType);

  if (success) {
    closeModal('registerModal');
    showLoginModal();
  }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Add some interactive features
  console.log('EduPlatform initialized successfully!');

  // Handle ESC key to close modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal('loginModal');
      closeModal('registerModal');
    }
  });
});

// Make functions immediately available globally
window.showLoginModal = function() {
  loginModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

window.showRegisterModal = function() {
  registerModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
};

window.closeModal = function(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';
};

window.switchToRegister = function() {
  closeModal('loginModal');
  showRegisterModal();
};

window.switchToLogin = function() {
  closeModal('registerModal');
  showLoginModal();
};

window.scrollToFeatures = function() {
  document.getElementById('features').scrollIntoView({ 
    behavior: 'smooth' 
  });
};
