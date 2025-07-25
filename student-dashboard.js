// Sample literature data
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
  }
];

// Display daily literature
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

// Logout function
async function logout() {
  console.log('Logging out...');
  await cikisYap();
}

// Course actions
function openCourse(courseName) {
  alert(`${courseName} dersi açılıyor...`);
  // Here you would navigate to the specific course page
}

// Test actions
function takeTest(testName) {
  alert(`${testName} testi başlatılıyor...`);
  // Here you would navigate to the test page
}

// Quick action handlers
document.addEventListener('DOMContentLoaded', function() {
  displayDailyLiterature();

  // Add click handlers for course cards
  const courseCards = document.querySelectorAll('.course-card .btn-primary');
  courseCards.forEach((button, index) => {
    const courseName = button.closest('.course-card').querySelector('h3').textContent;
    button.addEventListener('click', () => openCourse(courseName));
  });

  // Add click handlers for action cards
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', function() {
      const actionName = this.querySelector('h3').textContent;
      alert(`${actionName} özelliği yakında eklenecek!`);
    });
  });

  console.log('Student dashboard initialized successfully!');
});

// Export functions for global access
window.logout = logout;
window.openCourse = openCourse;
window.takeTest = takeTest;
