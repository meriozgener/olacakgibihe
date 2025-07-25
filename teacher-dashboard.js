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

// Sample uploaded content data
let uploadedContents = [
  {
    id: 1,
    title: "Divan Edebiyatı Sunumu",
    description: "Divan edebiyatının temel özellikleri ve önemli şairleri",
    type: "presentation",
    class: "11-A",
    subject: "Türk Dili ve Edebiyatı",
    uploadDate: "2024-01-15",
    fileName: "divan-edebiyati.pptx",
    content: "Bu sunum Divan Edebiyatının temel özelliklerini, önemli şairlerini ve eserlerini kapsamaktadır. Gazel, kaside, mesnevi gibi nazım türleri detaylı olarak açıklanmıştır."
  },
  {
    id: 2,
    title: "Anlam Bilgisi Konu Anlatımı",
    description: "Sözcüklerin anlamsal ilişkileri ve anlam değişmeleri",
    type: "pdf",
    class: "10-A",
    subject: "Türkçe",
    uploadDate: "2024-01-10",
    fileName: "anlam-bilgisi.pdf",
    content: "Bu dokümanda anlam bilgisi konusu detaylı olarak işlenmiştir. Eş anlam, karşıt anlam, mecaz anlam gibi konular örneklerle açıklanmıştır."
  },
  {
    id: 3,
    title: "Yazım Kuralları Test Soruları",
    description: "Yazım kuralları konusunda çoktan seçmeli sorular",
    type: "exam",
    class: "9-A",
    subject: "Türkçe",
    uploadDate: "2024-01-12",
    fileName: "yazim-kurallari-test.pdf",
    content: "Bu test yazım kuralları konusunda 20 adet çoktan seçmeli soru içermektedir. Öğrencilerin konuyu pekiştirmesi için hazırlanmıştır."
  }
];

// Load and display uploaded contents
function loadUploadedContents() {
  const contentList = document.getElementById('uploadedContentList');
  
  if (uploadedContents.length === 0) {
    contentList.innerHTML = `
      <div class="no-content">
        <i class="fas fa-folder-open"></i>
        <p>Henüz yüklenmiş içerik bulunmuyor.</p>
        <button class="btn-primary" onclick="uploadContent()">
          <i class="fas fa-plus"></i> İlk İçeriği Yükle
        </button>
      </div>
    `;
    return;
  }

  const contentHTML = uploadedContents.map(content => `
    <div class="content-item">
      <div class="content-icon">
        <i class="fas ${getContentIcon(content.type)}"></i>
      </div>
      <div class="content-info">
        <h4>${content.title}</h4>
        <p>${content.description}</p>
        <div class="content-meta">
          <span><i class="fas fa-users"></i> ${content.class}</span>
          <span><i class="fas fa-book"></i> ${content.subject}</span>
          <span><i class="fas fa-calendar"></i> ${formatDate(content.uploadDate)}</span>
        </div>
      </div>
      <div class="content-actions">
        <button class="btn-primary btn-small" onclick="viewContent(${content.id})">
          <i class="fas fa-eye"></i> Görüntüle
        </button>
        <button class="btn-outline btn-small" onclick="editContent(${content.id})">
          <i class="fas fa-edit"></i> Düzenle
        </button>
        <button class="btn-danger btn-small" onclick="deleteContent(${content.id})">
          <i class="fas fa-trash"></i> Sil
        </button>
      </div>
    </div>
  `).join('');

  contentList.innerHTML = contentHTML;
}

// Get content icon based on type
function getContentIcon(type) {
  switch(type) {
    case 'pdf': return 'fa-file-pdf';
    case 'video': return 'fa-file-video';
    case 'presentation': return 'fa-file-powerpoint';
    case 'exercise': return 'fa-file-alt';
    case 'exam': return 'fa-clipboard-list';
    default: return 'fa-file';
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
}

// View content in modal
function viewContent(contentId) {
  const content = uploadedContents.find(c => c.id === contentId);
  if (!content) return;

  const modal = document.getElementById('contentModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = content.title;
  modalBody.innerHTML = `
    <div class="content-viewer">
      <div class="content-header">
        <div class="content-meta-full">
          <span><i class="fas fa-users"></i> <strong>Sınıf:</strong> ${content.class}</span>
          <span><i class="fas fa-book"></i> <strong>Konu:</strong> ${content.subject}</span>
          <span><i class="fas fa-calendar"></i> <strong>Yüklenme Tarihi:</strong> ${formatDate(content.uploadDate)}</span>
          <span><i class="fas fa-file"></i> <strong>Dosya:</strong> ${content.fileName}</span>
        </div>
      </div>
      <div class="content-description">
        <h4>Açıklama:</h4>
        <p>${content.description}</p>
      </div>
      <div class="content-body">
        <h4>İçerik:</h4>
        <div class="content-text">
          ${content.content}
        </div>
      </div>
      <div class="content-actions-modal">
        <button class="btn-primary" onclick="shareContent(${content.id})">
          <i class="fas fa-share"></i> Öğrencilerle Paylaş
        </button>
        <button class="btn-outline" onclick="downloadContent(${content.id})">
          <i class="fas fa-download"></i> İndir
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

// Close content modal
function closeContentModal() {
  const modal = document.getElementById('contentModal');
  modal.style.display = 'none';
}

// Edit content
function editContent(contentId) {
  const content = uploadedContents.find(c => c.id === contentId);
  if (!content) return;
  
  alert(`${content.title} içeriği düzenleme sayfası açılıyor...`);
  // Here you would navigate to edit page or open edit modal
}

// Delete content
function deleteContent(contentId) {
  const content = uploadedContents.find(c => c.id === contentId);
  if (!content) return;

  if (confirm(`"${content.title}" içeriğini silmek istediğinizden emin misiniz?`)) {
    uploadedContents = uploadedContents.filter(c => c.id !== contentId);
    loadUploadedContents();
    alert('İçerik başarıyla silindi.');
  }
}

// Share content with students
function shareContent(contentId) {
  const content = uploadedContents.find(c => c.id === contentId);
  if (!content) return;

  alert(`"${content.title}" içeriği ${content.class} sınıfı öğrencileri ile paylaşıldı.`);
  // Here you would add the content to student-visible contents
}

// Download content
function downloadContent(contentId) {
  const content = uploadedContents.find(c => c.id === contentId);
  if (!content) return;

  alert(`${content.fileName} dosyası indiriliyor...`);
  // Here you would implement actual download functionality
}

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

  // Load uploaded contents
  setTimeout(() => {
    loadUploadedContents();
  }, 1000);

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
