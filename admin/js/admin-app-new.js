// Modern Admin Application with Full Functionality
const AdminAppNew = {
  currentSection: 'dashboard',
  dataAdapter: null,

  async init() {
    console.log('🚀 AdminAppNew initializing...');
    
    // Wait for data adapter
    this.dataAdapter = AdminDataAdapter;
    await this.dataAdapter.init();
    
    // Hide loading
    document.getElementById('loading-indicator')?.remove();
    
    this.initUI();
    this.initTheme();
    
    // Load dashboard
    await this.loadDashboard();
  },

  initUI() {
    // Username
    const usernameEl = document.getElementById('admin-username');
    if (usernameEl) {
      usernameEl.textContent = AdminAuth.getUsername();
    }

    // Sidebar navigation
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        await this.loadSection(section);
        
        // Update active state
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update page title
        const title = link.querySelector('span')?.textContent || section;
        document.getElementById('page-title').textContent = title;
      });
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        AdminAuth.logout();
      }
    });

    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
      });
    }
  },

  initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const getCurrentTheme = () => localStorage.getItem('theme') || 'dark';
    
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };
    
    applyTheme(getCurrentTheme());
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  },

  async loadSection(section) {
    this.currentSection = section;
    
    switch(section) {
      case 'dashboard':
        await this.loadDashboard();
        break;
      case 'hero':
        await this.loadHeroSection();
        break;
      case 'stats':
        await this.loadStatsSection();
        break;
      case 'projects':
        await this.loadProjectsSection();
        break;
      case 'services':
        await this.loadServicesSection();
        break;
      case 'timeline':
        await this.loadTimelineSection();
        break;
      case 'contact':
        await this.loadContactSection();
        break;
      case 'images':
        await this.loadImagesSection();
        break;
      default:
        await this.loadDashboard();
    }
  },

  showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `admin-alert admin-alert-${type}`;
    alert.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 400px;
    `;
    
    const icon = type === 'success' ? 'ri-checkbox-circle-line' : 
                 type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
    
    alert.innerHTML = `<i class="${icon}" style="font-size: 1.25rem;"></i><span>${message}</span>`;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
      alert.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => alert.remove(), 300);
    }, 4000);
  },

  async loadDashboard() {
    const data = await this.dataAdapter.loadData();
    const stats = data.stats || [];
    const projects = data.projects || [];
    const services = data.services || [];
    
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <!-- Welcome Section -->
        <div style="background: linear-gradient(135deg, var(--gold-dim), var(--gold)); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; color: #0a0a0a;">
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.75rem;">Welcome back, ${AdminAuth.getUsername()}! 👋</h2>
          <p style="margin: 0; opacity: 0.8;">Manage your website content from this dashboard</p>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          ${stats.map((stat, i) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
            const icons = ['ri-time-line', 'ri-building-line', 'ri-map-pin-line', 'ri-team-line'];
            return `
              <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 50px; height: 50px; background: ${colors[i]}22; color: ${colors[i]}; border-radius: 10px; display: grid; place-items: center; font-size: 1.5rem;">
                    <i class="${icons[i]}"></i>
                  </div>
                  <div>
                    <div style="font-size: 2rem; font-weight: bold; line-height: 1;">${stat.number}${stat.suffix}</div>
                    <div style="color: var(--muted); font-size: 0.9rem; margin-top: 0.25rem;">${stat.label}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Quick Actions -->
        <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem;">
          <h3 style="margin: 0 0 1.5rem 0; font-size: 1.25rem;">Quick Actions</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <button onclick="AdminAppNew.loadSection('hero')" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 1.25rem; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 1rem; transition: transform 0.2s;">
              <i class="ri-edit-box-line" style="font-size: 1.5rem;"></i>
              <span>Edit Hero</span>
            </button>
            <button onclick="AdminAppNew.loadSection('projects')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1.25rem; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 1rem;">
              <i class="ri-building-line" style="font-size: 1.5rem;"></i>
              <span>Manage Projects</span>
            </button>
            <button onclick="AdminAppNew.loadSection('services')" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 1.25rem; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 1rem;">
              <i class="ri-tools-line" style="font-size: 1.5rem;"></i>
              <span>Edit Services</span>
            </button>
            <button onclick="AdminAppNew.loadSection('images')" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 1.25rem; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 1rem;">
              <i class="ri-image-line" style="font-size: 1.5rem;"></i>
              <span>Upload Images</span>
            </button>
          </div>
        </div>

        <!-- Recent Projects -->
        <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 style="margin: 0 0 1.5rem 0; font-size: 1.25rem;">Recent Projects (${projects.length} total)</h3>
          <div style="display: grid; gap: 1rem;">
            ${projects.slice(-3).reverse().map(project => `
              <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">
                <div style="width: 60px; height: 60px; background: var(--gold-dim); border-radius: 8px; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                  <div style="font-weight: 600;">${project.title}</div>
                  <div style="color: var(--muted); font-size: 0.9rem; margin-top: 0.25rem;">${project.category} • ${project.year}</div>
                </div>
                <button onclick="AdminAppNew.loadSection('projects')" style="background: var(--gold); color: #0a0a0a; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
                  Edit
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  async loadHeroSection() {
    const hero = await this.dataAdapter.getSection('hero') || {};
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 2rem; margin: 0 0 0.5rem 0;">Hero Section</h2>
          <p style="color: var(--muted); margin: 0;">Edit the main homepage hero content</p>
        </div>

        <form id="hero-form" style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: grid; gap: 1.5rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Eyebrow Text</label>
              <input type="text" name="eyebrow" value="${hero.eyebrow || ''}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>

            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Main Title</label>
              <textarea name="title" rows="3" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem; font-family: inherit; resize: vertical;">${hero.title || ''}</textarea>
              <small style="color: var(--muted); font-size: 0.85rem;">Use &lt;em&gt; tags for emphasized text</small>
            </div>

            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Description</label>
              <textarea name="description" rows="4" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem; font-family: inherit; resize: vertical;">${hero.description || ''}</textarea>
            </div>

            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Hero Image Path</label>
              <input type="text" name="image" value="${hero.image || ''}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
              <small style="color: var(--muted); font-size: 0.85rem;">Example: images/hero-residence.jpeg</small>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Coordinates</label>
                <input type="text" name="coordinates" value="${hero.coordinates || ''}" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Figure Label</label>
                <input type="text" name="figureLabel" value="${hero.figureLabel || ''}" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
              </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <button type="submit" style="flex: 1; background: var(--gold); color: #0a0a0a; padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="ri-save-line"></i> Save Changes
              </button>
              <button type="button" onclick="AdminAppNew.loadHeroSection()" style="background: rgba(255,255,255,0.1); color: var(--ivory); padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('hero-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const heroData = Object.fromEntries(formData);
      
      console.log('📝 Submitting hero data:', heroData);
      
      try {
        await this.dataAdapter.updateSection('hero', heroData);
        this.showAlert('✅ Hero section updated successfully! Refresh the homepage to see changes.', 'success');
        
        // Reload the hero section form to show the saved data
        setTimeout(async () => {
          await this.loadHeroSection();
        }, 500);
      } catch (error) {
        console.error('Save error:', error);
        this.showAlert('❌ Failed to save: ' + error.message, 'error');
      }
    });
  },

  async loadImagesSection() {
    const allImages = ImageUploader.getAllImages();
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 2rem; margin: 0 0 0.5rem 0;">Image Manager</h2>
          <p style="color: var(--muted); margin: 0;">Upload and manage images for your website</p>
        </div>

        <!-- Image Upload Zone -->
        <div id="upload-zone" style="background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 12px; border: 2px dashed rgba(194, 158, 89, 0.3); text-align: center; margin-bottom: 2rem; cursor: pointer; transition: all 0.3s;">
          <i class="ri-upload-cloud-line" style="font-size: 4rem; color: var(--gold); display: block; margin-bottom: 1rem;"></i>
          <h3 style="margin: 0 0 0.5rem 0;">Drop images here or click to browse</h3>
          <p style="color: var(--muted); margin: 0;">Supported: JPG, PNG, WebP (max 5MB)</p>
          <input type="file" id="image-upload" accept="image/*" multiple style="display: none;">
        </div>

        <!-- Upload Progress -->
        <div id="upload-progress" style="display: none; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            <div class="spinner" style="width: 24px; height: 24px; border: 3px solid rgba(194, 158, 89, 0.3); border-top-color: var(--gold); border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span style="font-weight: 600;">Uploading images...</span>
          </div>
          <div id="progress-details" style="color: var(--muted); font-size: 0.9rem;"></div>
        </div>

        <!-- All Images -->
        <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0;">All Images (${allImages.length})</h3>
            <div style="display: flex; gap: 0.5rem;">
              <button onclick="AdminAppNew.loadImagesSection()" style="background: rgba(255,255,255,0.1); color: var(--ivory); padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="ri-refresh-line"></i> Refresh
              </button>
            </div>
          </div>
          <div id="images-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
            ${allImages.map((img, index) => `
              <div style="position: relative; background: rgba(255,255,255,0.03); border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <div style="aspect-ratio: 1; position: relative; overflow: hidden; background: #000;">
                  ${img.type === 'uploaded' && img.dataUrl ? 
                    `<img src="${img.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<img src="../${img.path}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23333%22 width=%22200%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2214%22>No Image</text></svg>';">`
                  }
                  <div style="position: absolute; top: 0.5rem; right: 0.5rem;">
                    <span style="background: ${img.type === 'uploaded' ? 'var(--gold)' : '#3b82f6'}; color: #fff; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;">
                      ${img.type === 'uploaded' ? 'Uploaded' : 'Existing'}
                    </span>
                  </div>
                </div>
                <div style="padding: 1rem;">
                  <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${img.filename}">${img.filename}</div>
                  <div style="color: var(--muted); font-size: 0.75rem; margin-bottom: 0.75rem;">
                    <code style="background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.7rem; display: block; overflow: hidden; text-overflow: ellipsis;">${img.path}</code>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button onclick="AdminAppNew.copyImagePath('${img.path}')" style="flex: 1; background: var(--gold); color: #0a0a0a; padding: 0.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
                      <i class="ri-file-copy-line"></i> Copy Path
                    </button>
                    ${img.type === 'uploaded' ? `
                      <button onclick="AdminAppNew.downloadImage(${index})" style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 0.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                        <i class="ri-download-line"></i>
                      </button>
                      <button onclick="AdminAppNew.deleteImage('${img.filename}')" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; padding: 0.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Instructions -->
        <div style="background: rgba(194, 158, 89, 0.1); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(194, 158, 89, 0.2); margin-top: 2rem;">
          <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;"><i class="ri-information-line"></i> How to Use Images</h4>
          <div style="color: var(--muted); line-height: 1.8;">
            <p style="margin: 0 0 0.5rem 0;"><strong>1. Upload:</strong> Drag & drop or click to select images</p>
            <p style="margin: 0 0 0.5rem 0;"><strong>2. Copy Path:</strong> Click "Copy Path" button on any image</p>
            <p style="margin: 0 0 0.5rem 0;"><strong>3. Use in Content:</strong> Paste the path in Hero, Projects, or Services sections</p>
            <p style="margin: 0 0 0.5rem 0;"><strong>Example:</strong> <code style="background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 3px;">images/your-image.jpg</code></p>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    // Setup upload functionality
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('image-upload');
    
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--gold)';
      uploadZone.style.background = 'rgba(194, 158, 89, 0.1)';
    });
    
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = 'rgba(194, 158, 89, 0.3)';
      uploadZone.style.background = 'rgba(255,255,255,0.05)';
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'rgba(194, 158, 89, 0.3)';
      uploadZone.style.background = 'rgba(255,255,255,0.05)';
      this.handleImageUpload(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
      this.handleImageUpload(e.target.files);
      e.target.value = ''; // Reset so same file can be uploaded again
    });
  },

  async handleImageUpload(files) {
    if (!files || files.length === 0) return;
    
    const progressDiv = document.getElementById('upload-progress');
    const progressDetails = document.getElementById('progress-details');
    
    progressDiv.style.display = 'block';
    progressDetails.textContent = `Processing ${files.length} image(s)...`;
    
    try {
      const results = await ImageUploader.handleFiles(files);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      progressDiv.style.display = 'none';
      
      if (successful.length > 0) {
        this.showAlert(`✅ Successfully uploaded ${successful.length} image(s)!`, 'success');
      }
      
      if (failed.length > 0) {
        this.showAlert(`⚠️ ${failed.length} image(s) failed: ${failed.map(f => f.error).join(', ')}`, 'error');
      }
      
      // Reload the images section
      await this.loadImagesSection();
      
    } catch (error) {
      progressDiv.style.display = 'none';
      this.showAlert('❌ Upload failed: ' + error.message, 'error');
    }
  },

  copyImagePath(path) {
    navigator.clipboard.writeText(path).then(() => {
      this.showAlert(`📋 Copied: ${path}`, 'success');
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = path;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showAlert(`📋 Copied: ${path}`, 'success');
    });
  },

  downloadImage(index) {
    const images = ImageUploader.getAllImages();
    const image = images[index];
    
    if (image && image.dataUrl) {
      ImageUploader.downloadImage(image);
      this.showAlert(`✅ Downloaded: ${image.filename}`, 'success');
    }
  },

  async deleteImage(filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
    
    try {
      ImageUploader.deleteImage(filename);
      this.showAlert(`✅ Deleted: ${filename}`, 'success');
      await this.loadImagesSection();
    } catch (error) {
      this.showAlert('❌ Delete failed: ' + error.message, 'error');
    }
  },

  async loadProjectsSection() {
    const projects = await this.dataAdapter.getSection('projects') || [];
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h2 style="font-size: 2rem; margin: 0 0 0.5rem 0;">Projects</h2>
            <p style="color: var(--muted); margin: 0;">${projects.length} projects total</p>
          </div>
          <button onclick="AdminAppNew.showProjectForm()" style="background: var(--gold); color: #0a0a0a; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-add-line"></i> Add Project
          </button>
        </div>

        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1);">
                <th style="padding: 1rem; text-align: left; font-weight: 600;">Code</th>
                <th style="padding: 1rem; text-align: left; font-weight: 600;">Title</th>
                <th style="padding: 1rem; text-align: left; font-weight: 600;">Category</th>
                <th style="padding: 1rem; text-align: left; font-weight: 600;">Year</th>
                <th style="padding: 1rem; text-align: right; font-weight: 600;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${projects.map((project, index) => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 1rem;">${project.projectCode}</td>
                  <td style="padding: 1rem; font-weight: 600;">${project.title}</td>
                  <td style="padding: 1rem; text-transform: capitalize;">${project.category}</td>
                  <td style="padding: 1rem;">${project.year}</td>
                  <td style="padding: 1rem; text-align: right;">
                    <button onclick="AdminAppNew.editProject(${index})" style="background: none; border: none; color: var(--gold); cursor: pointer; padding: 0.5rem; font-size: 1.1rem;">
                      <i class="ri-edit-line"></i>
                    </button>
                    <button onclick="AdminAppNew.deleteProject(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.5rem; font-size: 1.1rem;">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div id="project-form-container"></div>
      </div>
    `;
  },

  showProjectForm(project = null, index = null) {
    const isEdit = project !== null;
    const container = document.getElementById('project-form-container') || document.getElementById('admin-content');
    
    const formHTML = `
      <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 2rem;">
        <h3 style="margin: 0 0 1.5rem 0;">${isEdit ? 'Edit' : 'Add New'} Project</h3>
        <form id="project-form" style="display: grid; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Project Code</label>
              <input type="text" name="projectCode" value="${project?.projectCode || ''}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Title</label>
              <input type="text" name="title" value="${project?.title || ''}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Description</label>
            <textarea name="description" rows="3" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem; font-family: inherit; resize: vertical;">${project?.description || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Category</label>
              <select name="category" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
                <option value="residential" ${project?.category === 'residential' ? 'selected' : ''}>Residential</option>
                <option value="commercial" ${project?.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                <option value="public" ${project?.category === 'public' ? 'selected' : ''}>Public</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Year</label>
              <input type="text" name="year" value="${project?.year || new Date().getFullYear()}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Image Path</label>
              <input type="text" name="image" value="${project?.image || 'images/'}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button type="submit" style="flex: 1; background: var(--gold); color: #0a0a0a; padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Project
            </button>
            <button type="button" onclick="AdminAppNew.loadProjectsSection()" style="background: rgba(255,255,255,0.1); color: var(--ivory); padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;
    
    if (container.id === 'project-form-container') {
      container.innerHTML = formHTML;
    } else {
      container.innerHTML += formHTML;
    }
    
    document.getElementById('project-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const projectData = Object.fromEntries(formData);
      
      const projects = await this.dataAdapter.getSection('projects') || [];
      
      if (isEdit) {
        projects[index] = { ...project, ...projectData };
      } else {
        projectData.id = Date.now();
        projects.push(projectData);
      }
      
      try {
        await this.dataAdapter.updateSection('projects', projects);
        this.showAlert(`✅ Project ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
        await this.loadProjectsSection();
      } catch (error) {
        this.showAlert('❌ Failed to save: ' + error.message, 'error');
      }
    });
  },

  async editProject(index) {
    const projects = await this.dataAdapter.getSection('projects') || [];
    this.showProjectForm(projects[index], index);
  },

  async deleteProject(index) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const projects = await this.dataAdapter.getSection('projects') || [];
    projects.splice(index, 1);
    
    try {
      await this.dataAdapter.updateSection('projects', projects);
      this.showAlert('✅ Project deleted successfully!', 'success');
      await this.loadProjectsSection();
    } catch (error) {
      this.showAlert('❌ Failed to delete: ' + error.message, 'error');
    }
  },

  async loadServicesSection() {
    const services = await this.dataAdapter.getSection('services') || [];
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h2 style="font-size: 2rem; margin: 0 0 0.5rem 0;">Services</h2>
            <p style="color: var(--muted); margin: 0;">${services.length} services available</p>
          </div>
          <button onclick="AdminAppNew.showServiceForm()" style="background: var(--gold); color: #0a0a0a; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-add-line"></i> Add Service
          </button>
        </div>

        <div style="display: grid; gap: 1.5rem;">
          ${services.map((service, index) => `
            <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="font-size: 1.5rem; color: var(--gold); font-weight: 600;">${service.number}</div>
                  <h3 style="margin: 0; font-size: 1.25rem;">${service.title}</h3>
                </div>
                <div>
                  <button onclick="AdminAppNew.editService(${index})" style="background: none; border: none; color: var(--gold); cursor: pointer; padding: 0.5rem; font-size: 1.1rem;">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button onclick="AdminAppNew.deleteService(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.5rem; font-size: 1.1rem;">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
              <p style="margin: 0; color: var(--muted); line-height: 1.6;">${service.description}</p>
            </div>
          `).join('')}
        </div>

        <div id="service-form-container"></div>
      </div>
    `;
  },

  showServiceForm(service = null, index = null) {
    const isEdit = service !== null;
    const container = document.getElementById('service-form-container') || document.getElementById('admin-content');
    
    const formHTML = `
      <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 2rem;">
        <h3 style="margin: 0 0 1.5rem 0;">${isEdit ? 'Edit' : 'Add New'} Service</h3>
        <form id="service-form" style="display: grid; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 150px 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Number</label>
              <input type="text" name="number" value="${service?.number || ''}" placeholder="A—01" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Title</label>
              <input type="text" name="title" value="${service?.title || ''}" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem;">
            </div>
          </div>

          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--gold);">Description</label>
            <textarea name="description" rows="4" required style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ivory); font-size: 1rem; font-family: inherit; resize: vertical;">${service?.description || ''}</textarea>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button type="submit" style="flex: 1; background: var(--gold); color: #0a0a0a; padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Service
            </button>
            <button type="button" onclick="AdminAppNew.loadServicesSection()" style="background: rgba(255,255,255,0.1); color: var(--ivory); padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;
    
    if (container.id === 'service-form-container') {
      container.innerHTML = formHTML;
    } else {
      container.innerHTML += formHTML;
    }
    
    document.getElementById('service-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const serviceData = Object.fromEntries(formData);
      
      const services = await this.dataAdapter.getSection('services') || [];
      
      if (isEdit) {
        services[index] = { ...service, ...serviceData };
      } else {
        serviceData.id = Date.now();
        services.push(serviceData);
      }
      
      try {
        await this.dataAdapter.updateSection('services', services);
        this.showAlert(`✅ Service ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
        await this.loadServicesSection();
      } catch (error) {
        this.showAlert('❌ Failed to save: ' + error.message, 'error');
      }
    });
  },

  async editService(index) {
    const services = await this.dataAdapter.getSection('services') || [];
    this.showServiceForm(services[index], index);
  },

  async deleteService(index) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    const services = await this.dataAdapter.getSection('services') || [];
    services.splice(index, 1);
    
    try {
      await this.dataAdapter.updateSection('services', services);
      this.showAlert('✅ Service deleted successfully!', 'success');
      await this.loadServicesSection();
    } catch (error) {
      this.showAlert('❌ Failed to delete: ' + error.message, 'error');
    }
  },

  async loadStatsSection() {
    this.showAlert('Stats section - Coming soon!', 'info');
  },

  async loadTimelineSection() {
    this.showAlert('Timeline section - Coming soon!', 'info');
  },

  async loadContactSection() {
    this.showAlert('Contact section - Coming soon!', 'info');
  }
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AdminAppNew.init();
  });
} else {
  AdminAppNew.init();
}
