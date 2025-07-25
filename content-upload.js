
// Content Upload JavaScript
class ContentUploader {
  constructor() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.fileList = document.getElementById('fileList');
    this.uploadProgress = document.getElementById('uploadProgress');
    this.progressFill = document.getElementById('progressFill');
    this.progressText = document.getElementById('progressText');
    this.submitBtn = document.getElementById('submitBtn');
    this.contentForm = document.getElementById('contentForm');
    
    this.files = [];
    this.maxFileSize = 50 * 1024 * 1024; // 50MB
    this.allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'image/jpeg',
      'image/png'
    ];
    
    this.init();
  }
  
  init() {
    // Drag and drop events
    this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
    this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
    this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    this.uploadArea.addEventListener('click', () => this.fileInput.click());
    
    // File input change
    this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    
    // Form submit
    this.contentForm.addEventListener('submit', this.handleSubmit.bind(this));
  }
  
  handleDragOver(e) {
    e.preventDefault();
    this.uploadArea.classList.add('drag-over');
  }
  
  handleDragLeave(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('drag-over');
  }
  
  handleDrop(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }
  
  handleFileSelect(e) {
    const files = Array.from(e.target.files);
    this.processFiles(files);
  }
  
  processFiles(files) {
    files.forEach(file => {
      if (this.validateFile(file)) {
        this.files.push(file);
        this.displayFile(file);
      }
    });
    
    this.updateSubmitButton();
  }
  
  validateFile(file) {
    if (!this.allowedTypes.includes(file.type)) {
      this.showError(`${file.name}: Desteklenmeyen dosya türü`);
      return false;
    }
    
    if (file.size > this.maxFileSize) {
      this.showError(`${file.name}: Dosya boyutu çok büyük (Max: 50MB)`);
      return false;
    }
    
    return true;
  }
  
  displayFile(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-info">
        <i class="fas ${this.getFileIcon(file.type)}"></i>
        <div class="file-details">
          <span class="file-name">${file.name}</span>
          <span class="file-size">${this.formatFileSize(file.size)}</span>
        </div>
      </div>
      <button type="button" class="btn-remove" onclick="this.parentElement.remove(); contentUploader.removeFile('${file.name}')">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    this.fileList.appendChild(fileItem);
  }
  
  removeFile(fileName) {
    this.files = this.files.filter(file => file.name !== fileName);
    this.updateSubmitButton();
  }
  
  updateSubmitButton() {
    this.submitBtn.disabled = this.files.length === 0;
  }
  
  getFileIcon(type) {
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word')) return 'fa-file-word';
    if (type.includes('powerpoint')) return 'fa-file-powerpoint';
    if (type.includes('video')) return 'fa-file-video';
    if (type.includes('image')) return 'fa-file-image';
    return 'fa-file';
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.files.length === 0) {
      this.showError('Lütfen en az bir dosya seçin');
      return;
    }
    
    const formData = new FormData(this.contentForm);
    const contentData = {
      title: formData.get('contentTitle') || document.getElementById('contentTitle').value,
      description: formData.get('contentDescription') || document.getElementById('contentDescription').value,
      class: formData.get('contentClass') || document.getElementById('contentClass').value,
      subject: formData.get('contentSubject') || document.getElementById('contentSubject').value,
      type: formData.get('contentType') || document.getElementById('contentType').value
    };
    
    try {
      this.showProgress();
      await this.uploadFiles(contentData);
      this.showSuccess('İçerik başarıyla yüklendi!');
      this.resetForm();
    } catch (error) {
      console.error('Upload error:', error);
      this.showError('Yükleme sırasında bir hata oluştu');
    } finally {
      this.hideProgress();
    }
  }
  
  async uploadFiles(contentData) {
    const uploadPromises = this.files.map(async (file, index) => {
      return new Promise((resolve, reject) => {
        // Simulate file upload with progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            resolve();
          }
          this.updateProgress(progress);
        }, 200);
      });
    });
    
    await Promise.all(uploadPromises);
    
    // Here you would actually upload to Supabase Storage
    // const { data, error } = await supabase.storage
    //   .from('content')
    //   .upload(`${contentData.class}/${file.name}`, file);
  }
  
  updateProgress(progress) {
    this.progressFill.style.width = `${progress}%`;
    this.progressText.textContent = `${Math.round(progress)}%`;
  }
  
  showProgress() {
    this.uploadProgress.style.display = 'block';
    this.submitBtn.disabled = true;
  }
  
  hideProgress() {
    this.uploadProgress.style.display = 'none';
    this.submitBtn.disabled = false;
  }
  
  showError(message) {
    // Create and show error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
  
  showSuccess(message) {
    // Create and show success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
  
  resetForm() {
    this.files = [];
    this.fileList.innerHTML = '';
    this.contentForm.reset();
    this.updateSubmitButton();
  }
}

// Initialize uploader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.contentUploader = new ContentUploader();
});
