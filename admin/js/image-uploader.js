// Image Uploader - Handles image uploads and management
const ImageUploader = {
  uploadedImages: [],

  init() {
    // Load uploaded images from localStorage
    const stored = localStorage.getItem('biyaf_uploaded_images');
    if (stored) {
      this.uploadedImages = JSON.parse(stored);
    }
  },

  async handleFiles(files) {
    const results = [];
    
    for (const file of files) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        results.push({ success: false, filename: file.name, error: 'Not an image file' });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        results.push({ success: false, filename: file.name, error: 'File too large (max 5MB)' });
        continue;
      }

      try {
        const imageData = await this.processImage(file);
        results.push({ success: true, filename: file.name, data: imageData });
      } catch (error) {
        results.push({ success: false, filename: file.name, error: error.message });
      }
    }

    return results;
  },

  async processImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Optimize image if needed
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large (max 1920px width)
          const maxWidth = 1920;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          const imageData = {
            filename: file.name,
            originalName: file.name,
            dataUrl: dataUrl,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            path: `images/${file.name}`
          };
          
          // Save to localStorage
          this.uploadedImages.push(imageData);
          this.saveToStorage();
          
          resolve(imageData);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  saveToStorage() {
    // Store full image data including base64 dataUrl
    // Note: localStorage has ~5-10MB limit, but this allows uploaded images to be used
    try {
      localStorage.setItem('biyaf_uploaded_images', JSON.stringify(this.uploadedImages));
      console.log(`✅ Saved ${this.uploadedImages.length} uploaded images to storage`);
    } catch (error) {
      console.error('❌ Failed to save images (storage full?):', error);
      // Fallback: save only metadata
      const metadata = this.uploadedImages.map(img => ({
        filename: img.filename,
        originalName: img.originalName,
        size: img.size,
        type: img.type,
        uploadedAt: img.uploadedAt,
        path: img.path
      }));
      localStorage.setItem('biyaf_uploaded_images', JSON.stringify(metadata));
    }
  },

  getUploadedImages() {
    return this.uploadedImages;
  },

  deleteImage(filename) {
    this.uploadedImages = this.uploadedImages.filter(img => img.filename !== filename);
    this.saveToStorage();
  },

  // Generate download link for image
  downloadImage(imageData) {
    const link = document.createElement('a');
    link.href = imageData.dataUrl;
    link.download = imageData.filename;
    link.click();
  },

  // Get all current images (including existing ones)
  getAllImages() {
    const existingImages = [
      { filename: 'hero-residence.jpeg', path: 'images/hero-residence.jpeg', type: 'existing' },
      { filename: 'about-mansion.jpeg', path: 'images/about-mansion.jpeg', type: 'existing' },
      { filename: 'project-kebena.jpeg', path: 'images/project-kebena.jpeg', type: 'existing' },
      { filename: 'project-bole.jpeg', path: 'images/project-bole.jpeg', type: 'existing' },
      { filename: 'project-entoto.jpeg', path: 'images/project-entoto.jpeg', type: 'existing' },
      { filename: 'project-sarbet.jpeg', path: 'images/project-sarbet.jpeg', type: 'existing' },
      { filename: 'project-mercato.jpeg', path: 'images/project-mercato.jpeg', type: 'existing' },
      { filename: 'project-piassa.jpeg', path: 'images/project-piassa.jpeg', type: 'existing' }
    ];

    return [...existingImages, ...this.uploadedImages.map(img => ({ ...img, type: 'uploaded' }))];
  }
};

// Initialize on load
ImageUploader.init();
