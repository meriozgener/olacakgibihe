// Logout function
async function logout() {
  if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
    console.log('Logging out...');
    await cikisYap();
  }
}

// Class management functions
function manageClass(className) {
  alert(`${className} sınıfı yönetim paneli açılıyor...`);
  // Here you would navigate to class management page
}

function viewClassStats(className) {
  alert(`${className} sınıfı istatistikleri görüntüleniyor...`);
  // Here you would show detailed statistics
}

// Content management functions
function uploadContent() {
  window.location.href = 'content-upload.html';
}

function createTest() {
  alert('Test oluşturma sayfası açılıyor...');
  // Here you would navigate to test creation page
}

function addLiteraryText() {
  alert('Edebi metin ekleme paneli açılıyor...');
  // Here you would open literary text addition interface
}

function viewAnalytics() {
  alert('Analiz paneli açılıyor...');
  // Here you would show detailed analytics
}

// Sample class data
const classData = [
  {
    name: '11-A Türk Dili ve Edebiyatı',
    students: 28,
    activeStudents: 25,
    lastTestAverage: 82,
    status: 'success'
  },
  {
    name: '10-B Türkçe',
    students: 26,
    activeStudents: 24,
    lastTestAverage: 74,
    status: 'warning'
  }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers for class management buttons
  const manageButtons = document.querySelectorAll('.class-card .btn-primary');
  manageButtons.forEach((button, index) => {
    const className = button.closest('.class-card').querySelector('h3').textContent;
    button.addEventListener('click', () => manageClass(className));
  });

  // Add click handlers for statistics buttons
  const statsButtons = document.querySelectorAll('.class-card .btn-outline');
  statsButtons.forEach((button, index) => {
    const className = button.closest('.class-card').querySelector('h3').textContent;
    button.addEventListener('click', () => viewClassStats(className));
  });

  // Add click handlers for action cards
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', function() {
      const actionName = this.querySelector('h3').textContent;
      switch(actionName) {
        case 'İçerik Yükle':
          uploadContent();
          break;
        case 'Test Oluştur':
          createTest();
          break;
        case 'Edebi Metin':
          addLiteraryText();
          break;
        case 'Analiz Görüntüle':
          viewAnalytics();
          break;
        default:
          alert(`${actionName} özelliği yakında eklenecek!`);
      }
    });
  });

  console.log('Teacher dashboard initialized successfully!');
  
  // Auth durumunu kontrol et
  setTimeout(async () => {
    if (window.supabaseClient) {
      const user = await kullaniciDurumKontrol();
      if (user) {
        console.log('Teacher authenticated successfully:', user.email);
      } else {
        console.log('Teacher auth check failed');
      }
    }
  }, 2000);
});

// Export functions for global access
window.logout = logout;
window.manageClass = manageClass;
window.viewClassStats = viewClassStats;
window.uploadContent = uploadContent;
window.createTest = createTest;
window.addLiteraryText = addLiteraryText;
window.viewAnalytics = viewAnalytics;
