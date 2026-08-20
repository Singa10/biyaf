// Main Admin Application - Fixed Version
const AdminApp = {
  currentSection: 'dashboard',

  async init() {
    try {
      console.log('AdminApp initializing...');
      
      // Wait for Supabase to be ready
      if (!window.SupabaseClient) {
        console.log('Waiting for Supabase...');
        setTimeout(() => this.init(), 500);
        return;
      }
      
      // Initialize Supabase Data
      await SupabaseData.init();
      
      // Hide loading indicator
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      
      this.initUI();
      this.initTheme();
      await this.loadDashboard();
      
      console.log('AdminApp initialized successfully');
    } catch (error) {
      console.error('Error initializing AdminApp:', error);
      document.getElementById('admin-content').innerHTML = `
        <div class="alert alert-error">
          <i class="ri-error-warning-line"></i>
          <span>Error loading dashboard: ${error.message}</span>
        </div>
      `;
    }
  },

  // Initialize UI elements
  initUI() {
    // Set username
    const usernameEl = document.getElementById('admin-username');
    if (usernameEl) {
      usernameEl.textContent = AdminAuth.getUsername();
    }

    // Sidebar navigation
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.loadSection(section);
        
        // Update active state
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update page title
        const titleText = link.querySelector('span').textContent;
        document.getElementById('page-title').textContent = titleText;
      });
    });

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
          AdminAuth.logout();
        }
      });
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
      });
    }
  },

  // Initialize theme
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

  // Load section
  loadSection(section) {
    try {
      this.currentSection = section;
      
      switch(section) {
        case 'dashboard':
          this.loadDashboard();
          break;
        case 'hero':
          this.loadHeroSection();
          break;
        case 'stats':
          this.loadStatsSection();
          break;
        case 'projects':
          this.loadProjectsSection();
          break;
        case 'services':
          this.loadServicesSection();
          break;
        case 'about':
          this.loadAboutSection();
          break;
        case 'timeline':
          this.loadTimelineSection();
          break;
        case 'contact':
          this.loadContactSection();
          break;
        case 'images':
          this.loadImagesSection();
          break;
        default:
          this.loadDashboard();
      }
    } catch (error) {
      console.error('Error loading section:', error);
      this.showAlert('Error loading section: ' + error.message, 'error');
    }
  },

  // Show alert
  showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'ri-checkbox-circle-line' : 
                 type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
    
    alert.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    
    const content = document.getElementById('admin-content');
    if (content) {
      content.insertBefore(alert, content.firstChild);
      setTimeout(() => alert.remove(), 4000);
    }
  },

  // Load Dashboard
  async loadDashboard() {
    try {
      console.log('Loading dashboard...');
      
      const data = await SupabaseData.getData();
      console.log('Data loaded from Supabase:', data);
      
      if (!data || Object.keys(data).length === 0) {
        console.log('No data found, initializing defaults...');
        await SupabaseData.resetToDefaults();
        const newData = await SupabaseData.getData();
        console.log('Default data created:', newData);
        // Reload with new data
        return this.loadDashboard();
      }
      
      const stats = (data && data.stats) ? data.stats : [];
      const projects = (data && data.projects) ? data.projects : [];
      const services = (data && data.services) ? data.services : [];
      const timeline = (data && data.timeline) ? data.timeline : [];
      
      console.log('Stats:', stats.length, 'Projects:', projects.length);
      
      const residentialCount = projects.filter(p => p.category === 'residential').length;
      const commercialCount = projects.filter(p => p.category === 'commercial').length;
      const publicCount = projects.filter(p => p.category === 'public').length;
      
      const recentProjects = projects.slice(-3).reverse();
      
      const content = document.getElementById('admin-content');
      
      if (!content) {
        console.error('admin-content element not found!');
        return;
      }
      
      const dashboardHTML = this.generateDashboardHTML(stats, projects, services, timeline, residentialCount, commercialCount, publicCount, recentProjects, data);
      
      content.innerHTML = dashboardHTML;
      
      console.log('Dashboard rendered successfully!');
    } catch (error) {
      console.error('Error in loadDashboard:', error);
      const content = document.getElementById('admin-content');
      if (content) {
        content.innerHTML = `
          <div class="alert alert-error">
            <i class="ri-error-warning-line"></i>
            <span>Error loading dashboard: ${error.message}<br>Check console for details.</span>
          </div>
          <div class="content-section">
            <button class="btn btn-solid" onclick="AdminData.resetToDefaults(); AdminApp.loadDashboard();">
              <i class="ri-refresh-line"></i> Reset and Reload
            </button>
          </div>
        `;
      }
    }
  },

  generateDashboardHTML(stats, projects, services, timeline, residentialCount, commercialCount, publicCount, recentProjects, data) {
    const icons = ['ri-time-line', 'ri-building-line', 'ri-map-pin-line', 'ri-team-line'];
    const colors = ['#64b5f6', '#81c784', '#ffb74d', '#e57373'];
    
    return `
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1>Welcome back, ${AdminAuth.getUsername()}!</h1>
            <p>Here's what's happening with your architecture studio today.</p>
          </div>
          <div class="welcome-date">
            <i class="ri-calendar-line"></i>
            <span>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <!-- Main Stats -->
      <div class="stats-grid stats-grid-main">
        ${stats.map((stat, index) => `
          <div class="stat-card stat-card-enhanced" style="--accent-color: ${colors[index % 4]}">
            <div class="stat-card-icon-enhanced">
              <i class="${icons[index % 4]}"></i>
            </div>
            <div class="stat-card-content">
              <div class="stat-card-value-enhanced">${stat.number}${stat.suffix || ''}</div>
              <div class="stat-card-label-enhanced">${stat.label}</div>
            </div>
            <div class="stat-card-trend">
              <i class="ri-arrow-up-line"></i>
              <span>+${Math.floor(Math.random() * 15 + 5)}%</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Projects Overview -->
        <div class="dashboard-card">
          <div class="card-header-enhanced">
            <div>
              <h3>Projects Overview</h3>
              <p>${projects.length} Total Projects</p>
            </div>
            <button class="icon-btn" onclick="AdminApp.loadSection('projects')">
              <i class="ri-arrow-right-line"></i>
            </button>
          </div>
          <div class="chart-container">
            <div class="project-category-chart">
              ${projects.length > 0 ? `
                <div class="category-bar" style="--percentage: ${(residentialCount / projects.length * 100)}%; --bar-color: #64b5f6;">
                  <div class="category-label">
                    <i class="ri-home-line"></i>
                    <span>Residential</span>
                  </div>
                  <div class="category-count">${residentialCount}</div>
                </div>
                <div class="category-bar" style="--percentage: ${(commercialCount / projects.length * 100)}%; --bar-color: #81c784;">
                  <div class="category-label">
                    <i class="ri-store-line"></i>
                    <span>Commercial</span>
                  </div>
                  <div class="category-count">${commercialCount}</div>
                </div>
                <div class="category-bar" style="--percentage: ${(publicCount / projects.length * 100)}%; --bar-color: #ffb74d;">
                  <div class="category-label">
                    <i class="ri-building-2-line"></i>
                    <span>Public</span>
                  </div>
                  <div class="category-count">${publicCount}</div>
                </div>
              ` : '<div class="empty-state"><i class="ri-inbox-line"></i><p>No projects yet</p></div>'}
            </div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div class="dashboard-card">
          <div class="card-header-enhanced">
            <div>
              <h3>Recent Projects</h3>
              <p>Latest additions</p>
            </div>
            <button class="icon-btn" onclick="AdminApp.loadSection('projects')">
              <i class="ri-add-line"></i>
            </button>
          </div>
          <div class="recent-list">
            ${recentProjects.length > 0 ? recentProjects.map((project, idx) => {
              const bgColor = project.category === 'residential' ? '#64b5f6' : 
                             project.category === 'commercial' ? '#81c784' : '#ffb74d';
              return `
                <div class="recent-item">
                  <div class="recent-icon" style="background: ${bgColor}22; color: ${bgColor};">
                    <i class="ri-building-line"></i>
                  </div>
                  <div class="recent-content">
                    <div class="recent-title">${project.title}</div>
                    <div class="recent-meta">${project.category} • ${project.year}</div>
                  </div>
                  <button class="icon-btn-small" onclick="AdminApp.editProject(${projects.length - recentProjects.length + idx})">
                    <i class="ri-pencil-line"></i>
                  </button>
                </div>
              `;
            }).join('') : '<div class="empty-state"><i class="ri-inbox-line"></i><p>No projects yet</p></div>'}
          </div>
        </div>

        <!-- Services Status -->
        <div class="dashboard-card">
          <div class="card-header-enhanced">
            <div>
              <h3>Services</h3>
              <p>${services.length} Active Services</p>
            </div>
            <button class="icon-btn" onclick="AdminApp.loadSection('services')">
              <i class="ri-arrow-right-line"></i>
            </button>
          </div>
          <div class="services-grid-mini">
            ${services.slice(0, 4).map(service => `
              <div class="service-mini-card">
                <div class="service-mini-number">${service.number}</div>
                <div class="service-mini-title">${service.title}</div>
              </div>
            `).join('')}
          </div>
          ${services.length > 4 ? `<div class="card-footer-link" onclick="AdminApp.loadSection('services')">View all ${services.length} services <i class="ri-arrow-right-line"></i></div>` : ''}
        </div>

        <!-- Quick Actions -->
        <div class="dashboard-card quick-actions-card">
          <div class="card-header-enhanced">
            <div>
              <h3>Quick Actions</h3>
              <p>Manage your content</p>
            </div>
          </div>
          <div class="quick-actions-grid">
            <button class="quick-action-btn" onclick="AdminApp.loadSection('projects')" style="--action-color: #64b5f6;">
              <i class="ri-add-circle-line"></i>
              <span>New Project</span>
            </button>
            <button class="quick-action-btn" onclick="AdminApp.loadSection('services')" style="--action-color: #81c784;">
              <i class="ri-service-line"></i>
              <span>Add Service</span>
            </button>
            <button class="quick-action-btn" onclick="AdminApp.loadSection('timeline')" style="--action-color: #ffb74d;">
              <i class="ri-calendar-event-line"></i>
              <span>Add Milestone</span>
            </button>
            <button class="quick-action-btn" onclick="AdminData.exportData()" style="--action-color: #ba68c8;">
              <i class="ri-download-cloud-line"></i>
              <span>Export Data</span>
            </button>
            <button class="quick-action-btn" onclick="AdminApp.importData()" style="--action-color: #4fc3f7;">
              <i class="ri-upload-cloud-line"></i>
              <span>Import Data</span>
            </button>
            <button class="quick-action-btn" onclick="AdminApp.loadSection('hero')" style="--action-color: #e57373;">
              <i class="ri-edit-box-line"></i>
              <span>Edit Hero</span>
            </button>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="dashboard-card activity-card">
          <div class="card-header-enhanced">
            <div>
              <h3>Studio Timeline</h3>
              <p>${timeline.length} Milestones</p>
            </div>
            <button class="icon-btn" onclick="AdminApp.loadSection('timeline')">
              <i class="ri-arrow-right-line"></i>
            </button>
          </div>
          <div class="activity-timeline">
            ${timeline.slice(-4).reverse().map(item => `
              <div class="activity-item">
                <div class="activity-dot"></div>
                <div class="activity-content">
                  <div class="activity-title">${item.title}</div>
                  <div class="activity-meta">${item.year}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- System Info -->
        <div class="dashboard-card system-card">
          <div class="card-header-enhanced">
            <div>
              <h3>System Information</h3>
              <p>Dashboard stats</p>
            </div>
          </div>
          <div class="system-info-grid">
            <div class="system-info-item">
              <i class="ri-database-2-line"></i>
              <div>
                <div class="system-info-value">${(JSON.stringify(data).length / 1024).toFixed(2)} KB</div>
                <div class="system-info-label">Data Size</div>
              </div>
            </div>
            <div class="system-info-item">
              <i class="ri-refresh-line"></i>
              <div>
                <div class="system-info-value">Real-time</div>
                <div class="system-info-label">Updates</div>
              </div>
            </div>
            <div class="system-info-item">
              <i class="ri-shield-check-line"></i>
              <div>
                <div class="system-info-value">Active</div>
                <div class="system-info-label">Session</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Import data handler
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await AdminData.importData(file);
          this.showAlert('Data imported successfully!', 'success');
          this.loadDashboard();
        } catch (error) {
          this.showAlert('Failed to import data. Please check the file format.', 'error');
        }
      }
    };
    input.click();
  },

  // Load Hero Section
  async loadHeroSection() {
    try {
      const hero = await SupabaseData.getSection('hero') || {};
      const content = document.getElementById('admin-content');
      
      content.innerHTML = `
        <div class="hero-section-header">
          <div>
            <h2>Hero Section Management</h2>
            <p>Customize your home page hero section with text, images, and styling</p>
          </div>
          <button class="btn btn-secondary" onclick="AdminApp.previewHero()">
            <i class="ri-eye-line"></i> Preview
          </button>
        </div>

        <div class="hero-management-grid">
          <!-- Hero Content Form -->
          <div class="hero-form-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Hero Content</h3>
                <p>Main text and call-to-action buttons</p>
              </div>
              <i class="ri-text-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>

            <form id="hero-form" class="admin-form">
              <div class="form-group">
                <label>
                  <i class="ri-bookmark-line"></i> Eyebrow Text
                  <span class="form-hint">Small text above the main title</span>
                </label>
                <input type="text" name="eyebrow" value="${this.escapeHtml(hero.eyebrow || '')}" placeholder="Biyaf Architecture Studio" required>
              </div>

              <div class="form-group">
                <label>
                  <i class="ri-h-1"></i> Main Title
                  <span class="form-hint">Use &lt;em&gt; tags for italic/highlighted text</span>
                </label>
                <textarea name="title" rows="4" placeholder="We design buildings that &lt;em&gt;hold their ground&lt;/em&gt;." required>${this.escapeHtml(hero.title || '')}</textarea>
                <small class="form-note">Preview: ${hero.title || 'No title set'}</small>
              </div>

              <div class="form-group">
                <label>
                  <i class="ri-file-text-line"></i> Description
                  <span class="form-hint">Brief introduction text</span>
                </label>
                <textarea name="description" rows="5" placeholder="Enter a compelling description..." required>${this.escapeHtml(hero.description || '')}</textarea>
                <div class="char-counter">
                  <span id="desc-count">${(hero.description || '').length}</span> / 400 characters
                </div>
              </div>

              <div class="form-group">
                <label>
                  <i class="ri-links-line"></i> Call-to-Action Buttons
                </label>
                <div class="cta-buttons-manager">
                  <div class="cta-button-item">
                    <input type="text" placeholder="Button 1 Text" value="View Projects" readonly>
                    <input type="text" placeholder="Link URL" value="projects.html" readonly>
                    <select disabled>
                      <option value="solid">Solid</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                  <div class="cta-button-item">
                    <input type="text" placeholder="Button 2 Text" value="Start a Project" readonly>
                    <input type="text" placeholder="Link URL" value="contact.html" readonly>
                    <select disabled>
                      <option value="solid">Solid</option>
                      <option value="outline" selected>Outline</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-solid">
                  <i class="ri-save-line"></i> Save Changes
                </button>
                <button type="button" class="btn btn-secondary" onclick="AdminApp.loadHeroSection()">
                  <i class="ri-refresh-line"></i> Reset
                </button>
              </div>
            </form>
          </div>

          <!-- Hero Image Management -->
          <div class="hero-form-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Hero Image</h3>
                <p>Main visual for the hero section</p>
              </div>
              <i class="ri-image-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>

            <div class="image-manager">
              <div class="current-image-preview">
                <img src="../${hero.image || 'images/hero-residence.jpeg'}" alt="Hero Image" id="hero-image-preview">
                <div class="image-overlay">
                  <button class="btn btn-solid" onclick="document.getElementById('hero-image-input').click()">
                    <i class="ri-upload-2-line"></i> Change Image
                  </button>
                </div>
              </div>
              <input type="file" id="hero-image-input" accept="image/*" style="display: none;" onchange="AdminApp.handleHeroImageUpload(event)">

              <div class="image-details-form">
                <div class="form-group">
                  <label><i class="ri-image-line"></i> Image Path</label>
                  <input type="text" id="hero-image-path" value="${hero.image || 'images/hero-residence.jpeg'}" placeholder="images/hero-residence.jpeg" required>
                </div>

                <div class="form-group">
                  <label><i class="ri-text"></i> Image Alt Text</label>
                  <input type="text" id="hero-image-alt" value="${this.escapeHtml(hero.imageAlt || '')}" placeholder="Description for accessibility" required>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label><i class="ri-map-pin-line"></i> Coordinates</label>
                    <input type="text" id="hero-coordinates" value="${hero.coordinates || 'N 09°02\' E 38°45\''}" placeholder="N 09°02' E 38°45'">
                  </div>
                  <div class="form-group">
                    <label><i class="ri-bookmark-line"></i> Figure Label</label>
                    <input type="text" id="hero-figure-label" value="${hero.figureLabel || 'FIG. 01 — RESIDENCE'}" placeholder="FIG. 01 — RESIDENCE">
                  </div>
                </div>

                <button type="button" class="btn btn-solid" onclick="AdminApp.saveHeroImage()">
                  <i class="ri-save-line"></i> Update Image Details
                </button>
              </div>
            </div>
          </div>

          <!-- Live Preview -->
          <div class="hero-form-card hero-preview-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Live Preview</h3>
                <p>See how it looks on the website</p>
              </div>
              <i class="ri-tv-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>

            <div class="hero-preview-container">
              <div class="hero-preview-wrapper">
                <div class="preview-eyebrow">${hero.eyebrow || 'Biyaf Architecture Studio'}</div>
                <h1 class="preview-title">${hero.title || 'We design buildings that <em>hold their ground</em>.'}</h1>
                <p class="preview-description">${hero.description || 'Your description will appear here...'}</p>
                <div class="preview-buttons">
                  <button class="preview-btn preview-btn-solid">View Projects</button>
                  <button class="preview-btn preview-btn-outline">Start a Project</button>
                </div>
              </div>
              <div class="preview-image-wrapper">
                <img src="../${hero.image || 'images/hero-residence.jpeg'}" alt="Preview">
                <div class="preview-coordinates">${hero.coordinates || 'N 09°02\' E 38°45\''}</div>
                <div class="preview-figure">${hero.figureLabel || 'FIG. 01 — RESIDENCE'}</div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="hero-form-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Hero Section Stats</h3>
                <p>Content metrics and information</p>
              </div>
              <i class="ri-bar-chart-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>

            <div class="hero-stats-grid">
              <div class="hero-stat-item">
                <i class="ri-text"></i>
                <div>
                  <div class="hero-stat-value">${(hero.description || '').split(' ').length}</div>
                  <div class="hero-stat-label">Words</div>
                </div>
              </div>
              <div class="hero-stat-item">
                <i class="ri-character-recognition-line"></i>
                <div>
                  <div class="hero-stat-value">${(hero.description || '').length}</div>
                  <div class="hero-stat-label">Characters</div>
                </div>
              </div>
              <div class="hero-stat-item">
                <i class="ri-image-line"></i>
                <div>
                  <div class="hero-stat-value">${hero.image ? '1' : '0'}</div>
                  <div class="hero-stat-label">Image</div>
                </div>
              </div>
              <div class="hero-stat-item">
                <i class="ri-links-line"></i>
                <div>
                  <div class="hero-stat-value">2</div>
                  <div class="hero-stat-label">CTA Buttons</div>
                </div>
              </div>
            </div>

            <div class="hero-tips">
              <h4><i class="ri-lightbulb-line"></i> Best Practices</h4>
              <ul>
                <li>Keep title under 80 characters for optimal readability</li>
                <li>Description should be 200-400 characters</li>
                <li>Use high-quality images (recommended: 1920x1080px)</li>
                <li>Test on mobile devices for responsiveness</li>
                <li>Use &lt;em&gt; tags to highlight key phrases</li>
              </ul>
            </div>
          </div>
        </div>
      `;

      // Initialize form handler
      this.initHeroForm();
      
    } catch (error) {
      console.error('Error loading hero section:', error);
      this.showAlert('Error loading hero section: ' + error.message, 'error');
    }
  },

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Initialize hero form
  initHeroForm() {
    const form = document.getElementById('hero-form');
    if (!form) return;

    // Character counter for description
    const descTextarea = form.querySelector('textarea[name="description"]');
    const descCounter = document.getElementById('desc-count');
    
    if (descTextarea && descCounter) {
      descTextarea.addEventListener('input', (e) => {
        descCounter.textContent = e.target.value.length;
        if (e.target.value.length > 400) {
          descCounter.style.color = '#e57373';
        } else {
          descCounter.style.color = 'var(--muted)';
        }
      });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveHeroContent(new FormData(e.target));
    });
  },

  // Save hero content
  saveHeroContent(formData) {
    try {
      const hero = AdminData.getSection('hero') || {};
      
      hero.eyebrow = formData.get('eyebrow');
      hero.title = formData.get('title');
      hero.description = formData.get('description');
      
      AdminData.updateSection('hero', hero);
      this.showAlert('Hero content saved successfully!', 'success');
      
      // Reload to show updated preview
      setTimeout(() => this.loadHeroSection(), 1000);
      
    } catch (error) {
      console.error('Error saving hero content:', error);
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },

  // Save hero image details
  saveHeroImage() {
    try {
      const hero = AdminData.getSection('hero') || {};
      
      hero.image = document.getElementById('hero-image-path').value;
      hero.imageAlt = document.getElementById('hero-image-alt').value;
      hero.coordinates = document.getElementById('hero-coordinates').value;
      hero.figureLabel = document.getElementById('hero-figure-label').value;
      
      AdminData.updateSection('hero', hero);
      this.showAlert('Hero image details saved successfully!', 'success');
      
      // Update preview image
      const previewImg = document.getElementById('hero-image-preview');
      if (previewImg) {
        previewImg.src = '../' + hero.image;
      }
      
    } catch (error) {
      console.error('Error saving image details:', error);
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },

  // Handle image upload (simulate - in production, upload to server)
  handleHeroImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showAlert('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showAlert('Image size should be less than 5MB', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('hero-image-preview');
      if (previewImg) {
        previewImg.src = e.target.result;
      }
      
      // Update path (in production, this would be the uploaded file path)
      const imagePath = 'images/' + file.name;
      document.getElementById('hero-image-path').value = imagePath;
      
      this.showAlert('Image uploaded! Click "Update Image Details" to save.', 'info');
    };
    reader.readAsDataURL(file);
  },

  // Preview hero section
  previewHero() {
    const hero = AdminData.getSection('hero') || {};
    window.open('../index.html', '_blank');
  },
  loadStatsSection() {
    try {
      const stats = AdminData.getSection('stats') || [];
      const content = document.getElementById('admin-content');
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>Statistics Management</h2>
            <p>Manage your company statistics displayed on the home page</p>
          </div>
          <button class="btn btn-solid" onclick="AdminApp.showStatModal()">
            <i class="ri-add-line"></i> Add Statistic
          </button>
        </div>

        <!-- Stats Overview -->
        <div class="stats-overview-grid">
          <div class="overview-card">
            <i class="ri-bar-chart-box-line"></i>
            <div>
              <div class="overview-value">${stats.length}</div>
              <div class="overview-label">Total Statistics</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-eye-line"></i>
            <div>
              <div class="overview-value">Home Page</div>
              <div class="overview-label">Display Location</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-layout-grid-line"></i>
            <div>
              <div class="overview-value">4 Columns</div>
              <div class="overview-label">Grid Layout</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-refresh-line"></i>
            <div>
              <div class="overview-value">Real-time</div>
              <div class="overview-label">Updates</div>
            </div>
          </div>
        </div>

        <!-- Stats Cards Grid -->
        <div class="stats-cards-container">
          <div class="stats-cards-grid">
            ${stats.map((stat, index) => {
              const icons = ['ri-time-line', 'ri-building-line', 'ri-map-pin-line', 'ri-team-line'];
              const colors = ['#64b5f6', '#81c784', '#ffb74d', '#e57373'];
              return `
                <div class="stat-card-manage" style="--card-color: ${colors[index % 4]}">
                  <div class="stat-card-header-manage">
                    <div class="stat-icon-manage">
                      <i class="${icons[index % 4]}"></i>
                    </div>
                    <div class="stat-actions-manage">
                      <button class="icon-btn-mini" onclick="AdminApp.editStat(${index})" title="Edit">
                        <i class="ri-edit-line"></i>
                      </button>
                      <button class="icon-btn-mini delete" onclick="AdminApp.deleteStat(${index})" title="Delete">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <div class="stat-content-manage">
                    <div class="stat-number-manage">${stat.number}${stat.suffix || ''}</div>
                    <div class="stat-label-manage">${stat.label}</div>
                  </div>
                  <div class="stat-meta-manage">
                    <span class="stat-badge">Position ${index + 1}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          ${stats.length === 0 ? `
            <div class="empty-state-large">
              <i class="ri-bar-chart-line"></i>
              <h3>No Statistics Yet</h3>
              <p>Add your first statistic to display key metrics on your home page</p>
              <button class="btn btn-solid" onclick="AdminApp.showStatModal()">
                <i class="ri-add-line"></i> Add First Statistic
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Tips -->
        <div class="tips-card">
          <h3><i class="ri-lightbulb-line"></i> Statistics Tips</h3>
          <div class="tips-grid">
            <div class="tip-item">
              <i class="ri-check-line"></i>
              <span>Keep numbers realistic and verifiable</span>
            </div>
            <div class="tip-item">
              <i class="ri-check-line"></i>
              <span>Use clear, concise labels (2-3 words)</span>
            </div>
            <div class="tip-item">
              <i class="ri-check-line"></i>
              <span>Add '+' suffix for growing numbers</span>
            </div>
            <div class="tip-item">
              <i class="ri-check-line"></i>
              <span>Recommended: 4 statistics for best layout</span>
            </div>
          </div>
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading stats section:', error);
      this.showAlert('Error loading statistics: ' + error.message, 'error');
    }
  },

  showStatModal(stat = null, index = null) {
    const isEdit = stat !== null;
    const modalHTML = `
      <div class="modal-overlay" id="stat-modal" onclick="AdminApp.closeStatModal(event)">
        <div class="modal-container" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="ri-bar-chart-line"></i> ${isEdit ? 'Edit' : 'Add'} Statistic</h3>
            <button class="modal-close" onclick="AdminApp.closeStatModal()">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <form id="stat-form" class="modal-form">
            <div class="form-group">
              <label><i class="ri-hashtag"></i> Number</label>
              <input type="number" name="number" value="${stat?.number || ''}" placeholder="14" required min="0">
              <small>The numeric value to display</small>
            </div>
            <div class="form-group">
              <label><i class="ri-text"></i> Label</label>
              <input type="text" name="label" value="${stat?.label || ''}" placeholder="Years in Practice" required>
              <small>Short descriptive text (e.g., "Projects Delivered")</small>
            </div>
            <div class="form-group">
              <label><i class="ri-add-circle-line"></i> Suffix (Optional)</label>
              <input type="text" name="suffix" value="${stat?.suffix || ''}" placeholder="+" maxlength="3">
              <small>Add '+', 'K', 'M', etc. after the number</small>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Statistic
              </button>
              <button type="button" class="btn btn-secondary" onclick="AdminApp.closeStatModal()">
                <i class="ri-close-line"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('stat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveStat(new FormData(e.target), index);
    });
  },

  closeStatModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('stat-modal');
    if (modal) modal.remove();
  },

  saveStat(formData, index) {
    try {
      const stats = AdminData.getSection('stats') || [];
      const statData = {
        number: parseInt(formData.get('number')),
        label: formData.get('label'),
        suffix: formData.get('suffix') || ''
      };
      
      if (index !== null) {
        stats[index] = statData;
        this.showAlert('Statistic updated successfully!', 'success');
      } else {
        stats.push(statData);
        this.showAlert('Statistic added successfully!', 'success');
      }
      
      AdminData.updateSection('stats', stats);
      this.closeStatModal();
      this.loadStatsSection();
      
    } catch (error) {
      console.error('Error saving stat:', error);
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },

  editStat(index) {
    const stats = AdminData.getSection('stats') || [];
    this.showStatModal(stats[index], index);
  },

  deleteStat(index) {
    if (confirm('Are you sure you want to delete this statistic?')) {
      try {
        const stats = AdminData.getSection('stats') || [];
        stats.splice(index, 1);
        AdminData.updateSection('stats', stats);
        this.showAlert('Statistic deleted successfully!', 'success');
        this.loadStatsSection();
      } catch (error) {
        console.error('Error deleting stat:', error);
        this.showAlert('Error deleting: ' + error.message, 'error');
      }
    }
  },
  loadProjectsSection() {
    try {
      const projects = AdminData.getSection('projects') || [];
      const residential = projects.filter(p => p.category === 'residential').length;
      const commercial = projects.filter(p => p.category === 'commercial').length;
      const publicProjects = projects.filter(p => p.category === 'public').length;
      
      const content = document.getElementById('admin-content');
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>Projects Management</h2>
            <p>Manage your architecture projects portfolio</p>
          </div>
          <div class="header-actions">
            <div class="filter-tabs">
              <button class="filter-tab active" data-filter="all" onclick="AdminApp.filterProjects('all')">
                All (${projects.length})
              </button>
              <button class="filter-tab" data-filter="residential" onclick="AdminApp.filterProjects('residential')">
                Residential (${residential})
              </button>
              <button class="filter-tab" data-filter="commercial" onclick="AdminApp.filterProjects('commercial')">
                Commercial (${commercial})
              </button>
              <button class="filter-tab" data-filter="public" onclick="AdminApp.filterProjects('public')">
                Public (${publicProjects})
              </button>
            </div>
            <button class="btn btn-solid" onclick="AdminApp.showProjectModal()">
              <i class="ri-add-line"></i> Add Project
            </button>
          </div>
        </div>

        <!-- Projects Overview -->
        <div class="stats-overview-grid">
          <div class="overview-card" style="--accent: #64b5f6;">
            <i class="ri-home-line"></i>
            <div>
              <div class="overview-value">${residential}</div>
              <div class="overview-label">Residential</div>
            </div>
          </div>
          <div class="overview-card" style="--accent: #81c784;">
            <i class="ri-store-line"></i>
            <div>
              <div class="overview-value">${commercial}</div>
              <div class="overview-label">Commercial</div>
            </div>
          </div>
          <div class="overview-card" style="--accent: #ffb74d;">
            <i class="ri-building-2-line"></i>
            <div>
              <div class="overview-value">${publicProjects}</div>
              <div class="overview-label">Public</div>
            </div>
          </div>
          <div class="overview-card" style="--accent: #ba68c8;">
            <i class="ri-folder-line"></i>
            <div>
              <div class="overview-value">${projects.length}</div>
              <div class="overview-label">Total Projects</div>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="projects-grid">
          ${projects.length > 0 ? projects.map((project, index) => {
            const categoryColors = {
              residential: '#64b5f6',
              commercial: '#81c784',
              public: '#ffb74d'
            };
            return `
              <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                  <img src="../${project.image}" alt="${project.title}" onerror="this.src='../images/hero-residence.jpeg'">
                  <div class="project-overlay">
                    <button class="icon-btn-large" onclick="AdminApp.editProject(${index})" title="Edit">
                      <i class="ri-edit-line"></i>
                    </button>
                    <button class="icon-btn-large delete" onclick="AdminApp.deleteProject(${index})" title="Delete">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
                <div class="project-content">
                  <div class="project-header">
                    <span class="project-code">${project.projectCode}</span>
                    <span class="project-category" style="background: ${categoryColors[project.category]}22; color: ${categoryColors[project.category]};">
                      ${project.category}
                    </span>
                  </div>
                  <h3 class="project-title">${project.title}</h3>
                  <p class="project-description">${project.description}</p>
                  <div class="project-meta">
                    <span><i class="ri-calendar-line"></i> ${project.year}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="empty-state-large" style="grid-column: 1 / -1;">
              <i class="ri-building-line"></i>
              <h3>No Projects Yet</h3>
              <p>Start building your portfolio by adding your first project</p>
              <button class="btn btn-solid" onclick="AdminApp.showProjectModal()">
                <i class="ri-add-line"></i> Add First Project
              </button>
            </div>
          `}
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading projects section:', error);
      this.showAlert('Error loading projects: ' + error.message, 'error');
    }
  },

  filterProjects(category) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.filter === category) {
        tab.classList.add('active');
      }
    });

    // Filter projects
    document.querySelectorAll('.project-card').forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  },

  showProjectModal(project = null, index = null) {
    const isEdit = project !== null;
    const modalHTML = `
      <div class="modal-overlay" id="project-modal" onclick="AdminApp.closeProjectModal(event)">
        <div class="modal-container modal-large" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="ri-building-line"></i> ${isEdit ? 'Edit' : 'Add'} Project</h3>
            <button class="modal-close" onclick="AdminApp.closeProjectModal()">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <form id="project-form" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label><i class="ri-hashtag"></i> Project Code</label>
                <input type="text" name="projectCode" value="${project?.projectCode || ''}" placeholder="PRJ.014" required>
                <small>Unique identifier (e.g., PRJ.014)</small>
              </div>
              <div class="form-group">
                <label><i class="ri-calendar-line"></i> Year</label>
                <input type="text" name="year" value="${project?.year || new Date().getFullYear()}" placeholder="2024" required>
                <small>Completion year</small>
              </div>
            </div>

            <div class="form-group">
              <label><i class="ri-text"></i> Project Title</label>
              <input type="text" name="title" value="${project?.title || ''}" placeholder="Kebena Residence" required>
              <small>Full project name</small>
            </div>

            <div class="form-group">
              <label><i class="ri-file-text-line"></i> Description</label>
              <textarea name="description" rows="3" placeholder="A terraced concrete home stepping down a ridge..." required>${project?.description || ''}</textarea>
              <small>Brief project description (80-120 characters recommended)</small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label><i class="ri-folder-line"></i> Category</label>
                <select name="category" required>
                  <option value="residential" ${project?.category === 'residential' ? 'selected' : ''}>Residential</option>
                  <option value="commercial" ${project?.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                  <option value="public" ${project?.category === 'public' ? 'selected' : ''}>Public</option>
                </select>
              </div>
              <div class="form-group">
                <label><i class="ri-image-line"></i> Image Path</label>
                <input type="text" name="image" value="${project?.image || ''}" placeholder="images/project-name.jpeg" required>
                <small>Path to project image</small>
              </div>
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Project
              </button>
              <button type="button" class="btn btn-secondary" onclick="AdminApp.closeProjectModal()">
                <i class="ri-close-line"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveProject(new FormData(e.target), index);
    });
  },

  closeProjectModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('project-modal');
    if (modal) modal.remove();
  },

  saveProject(formData, index) {
    try {
      const projects = AdminData.getSection('projects') || [];
      const projectData = {
        projectCode: formData.get('projectCode'),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        year: formData.get('year'),
        image: formData.get('image'),
        id: index !== null ? projects[index].id : Date.now()
      };
      
      if (index !== null) {
        projects[index] = projectData;
        this.showAlert('Project updated successfully!', 'success');
      } else {
        projects.push(projectData);
        this.showAlert('Project added successfully!', 'success');
      }
      
      AdminData.updateSection('projects', projects);
      this.closeProjectModal();
      this.loadProjectsSection();
      
    } catch (error) {
      console.error('Error saving project:', error);
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },

  editProject(index) {
    const projects = AdminData.getSection('projects') || [];
    this.showProjectModal(projects[index], index);
  },

  deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const projects = AdminData.getSection('projects') || [];
        projects.splice(index, 1);
        AdminData.updateSection('projects', projects);
        this.showAlert('Project deleted successfully!', 'success');
        this.loadProjectsSection();
      } catch (error) {
        console.error('Error deleting project:', error);
        this.showAlert('Error deleting: ' + error.message, 'error');
      }
    }
  },
  loadServicesSection() {
    try {
      const services = AdminData.getSection('services') || [];
      const content = document.getElementById('admin-content');
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>Services Management</h2>
            <p>Manage your architecture services and capabilities</p>
          </div>
          <button class="btn btn-solid" onclick="AdminApp.showServiceModal()">
            <i class="ri-add-line"></i> Add Service
          </button>
        </div>

        <div class="stats-overview-grid">
          <div class="overview-card">
            <i class="ri-service-line"></i>
            <div>
              <div class="overview-value">${services.length}</div>
              <div class="overview-label">Total Services</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-layout-grid-line"></i>
            <div>
              <div class="overview-value">Grid</div>
              <div class="overview-label">Display Style</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-pages-line"></i>
            <div>
              <div class="overview-value">Services Page</div>
              <div class="overview-label">Location</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-sort-asc"></i>
            <div>
              <div class="overview-value">Sequential</div>
              <div class="overview-label">Numbering</div>
            </div>
          </div>
        </div>

        <div class="services-list">
          ${services.length > 0 ? services.map((service, index) => `
            <div class="service-item">
              <div class="service-number">${service.number}</div>
              <div class="service-content">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
              </div>
              <div class="service-actions">
                <button class="icon-btn edit" onclick="AdminApp.editService(${index})">
                  <i class="ri-edit-line"></i>
                </button>
                <button class="icon-btn delete" onclick="AdminApp.deleteService(${index})">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state-large">
              <i class="ri-service-line"></i>
              <h3>No Services Yet</h3>
              <p>Add your first service to showcase your capabilities</p>
              <button class="btn btn-solid" onclick="AdminApp.showServiceModal()">
                <i class="ri-add-line"></i> Add First Service
              </button>
            </div>
          `}
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading services:', error);
      this.showAlert('Error loading services: ' + error.message, 'error');
    }
  },

  showServiceModal(service = null, index = null) {
    const isEdit = service !== null;
    const modalHTML = `
      <div class="modal-overlay" id="service-modal" onclick="AdminApp.closeServiceModal(event)">
        <div class="modal-container modal-large" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="ri-service-line"></i> ${isEdit ? 'Edit' : 'Add'} Service</h3>
            <button class="modal-close" onclick="AdminApp.closeServiceModal()">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <form id="service-form" class="modal-form">
            <div class="form-group">
              <label><i class="ri-hashtag"></i> Service Number</label>
              <input type="text" name="number" value="${service?.number || ''}" placeholder="A—01" required>
              <small>Format: A—01, A—02, etc.</small>
            </div>
            <div class="form-group">
              <label><i class="ri-text"></i> Title</label>
              <input type="text" name="title" value="${service?.title || ''}" placeholder="Architectural Design" required>
            </div>
            <div class="form-group">
              <label><i class="ri-file-text-line"></i> Description</label>
              <textarea name="description" rows="4" required>${service?.description || ''}</textarea>
              <small>Detailed description of the service</small>
            </div>
            <div class="modal-actions">
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Service
              </button>
              <button type="button" class="btn btn-secondary" onclick="AdminApp.closeServiceModal()">
                <i class="ri-close-line"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('service-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveService(new FormData(e.target), index);
    });
  },

  closeServiceModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('service-modal');
    if (modal) modal.remove();
  },

  saveService(formData, index) {
    try {
      const services = AdminData.getSection('services') || [];
      const serviceData = {
        number: formData.get('number'),
        title: formData.get('title'),
        description: formData.get('description'),
        id: index !== null ? services[index].id : Date.now()
      };
      
      if (index !== null) {
        services[index] = serviceData;
        this.showAlert('Service updated successfully!', 'success');
      } else {
        services.push(serviceData);
        this.showAlert('Service added successfully!', 'success');
      }
      
      AdminData.updateSection('services', services);
      this.closeServiceModal();
      this.loadServicesSection();
    } catch (error) {
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },

  editService(index) {
    const services = AdminData.getSection('services') || [];
    this.showServiceModal(services[index], index);
  },

  deleteService(index) {
    if (confirm('Are you sure you want to delete this service?')) {
      const services = AdminData.getSection('services') || [];
      services.splice(index, 1);
      AdminData.updateSection('services', services);
      this.showAlert('Service deleted successfully!', 'success');
      this.loadServicesSection();
    }
  },
  loadAboutSection() {
    try {
      const content = document.getElementById('admin-content');
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>About Us Management</h2>
            <p>Manage your studio's story and information</p>
          </div>
        </div>

        <div class="about-sections-grid">
          <!-- About Content -->
          <div class="about-section-card">
            <div class="about-section-icon">
              <i class="ri-article-line"></i>
            </div>
            <h3>About Content</h3>
            <p>The main about page content is managed directly in the about.html file. Use your text editor to modify the content, mission, vision, and team information.</p>
            <div class="about-actions">
              <button class="btn btn-solid" onclick="window.open('../about.html', '_blank')">
                <i class="ri-eye-line"></i> View About Page
              </button>
            </div>
          </div>

          <!-- Timeline Integration -->
          <div class="about-section-card">
            <div class="about-section-icon">
              <i class="ri-time-line"></i>
            </div>
            <h3>Company Timeline</h3>
            <p>Your company's history and milestones are displayed on the about page. Manage timeline entries from the Timeline section.</p>
            <div class="about-actions">
              <button class="btn btn-solid" onclick="AdminApp.loadSection('timeline')">
                <i class="ri-edit-line"></i> Manage Timeline
              </button>
            </div>
          </div>

          <!-- Team Information -->
          <div class="about-section-card">
            <div class="about-section-icon">
              <i class="ri-team-line"></i>
            </div>
            <h3>Team Members</h3>
            <p>Team member information and profiles are managed in the about.html file. Edit the HTML directly to add or update team members.</p>
            <div class="about-actions">
              <button class="btn btn-secondary" onclick="alert('Edit the about.html file in your code editor to manage team members.')">
                <i class="ri-information-line"></i> Learn More
              </button>
            </div>
          </div>

          <!-- Studio Images -->
          <div class="about-section-card">
            <div class="about-section-icon">
              <i class="ri-image-line"></i>
            </div>
            <h3>Studio Images</h3>
            <p>Manage images used throughout your website including the about page from the Images section.</p>
            <div class="about-actions">
              <button class="btn btn-solid" onclick="AdminApp.loadSection('images')">
                <i class="ri-folder-open-line"></i> Manage Images
              </button>
            </div>
          </div>

          <!-- Information Card -->
          <div class="about-info-card">
            <div class="card-header-enhanced">
              <div>
                <h3>About Section Guidelines</h3>
                <p>Important information about managing the About page</p>
              </div>
              <i class="ri-information-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>
            <ul class="about-info-list">
              <li>
                <i class="ri-file-edit-line"></i>
                <span><strong>Direct File Editing:</strong> The about.html file contains your company story, mission, vision, and values. Edit this file directly to update content.</span>
              </li>
              <li>
                <i class="ri-time-line"></i>
                <span><strong>Timeline Integration:</strong> Your company timeline is dynamically loaded from the data you manage in the Timeline section of this dashboard.</span>
              </li>
              <li>
                <i class="ri-team-line"></i>
                <span><strong>Team Profiles:</strong> Add or update team member cards in the about.html file. Each card includes a photo, name, title, and description.</span>
              </li>
              <li>
                <i class="ri-image-line"></i>
                <span><strong>Image Management:</strong> All images used on the about page (hero image, team photos, etc.) can be managed from the Images section.</span>
              </li>
              <li>
                <i class="ri-layout-line"></i>
                <span><strong>Layout Structure:</strong> The about page uses a structured layout with sections for hero, story, values, timeline, and team. Maintain this structure when editing.</span>
              </li>
              <li>
                <i class="ri-palette-line"></i>
                <span><strong>Styling:</strong> The page automatically adapts to dark/light mode. Ensure any custom content follows the existing design patterns.</span>
              </li>
            </ul>
          </div>
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading about section:', error);
      this.showAlert('Error loading about section: ' + error.message, 'error');
    }
  },
  loadTimelineSection() {
    try {
      const timeline = AdminData.getSection('timeline') || [];
      const sortedTimeline = timeline.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      const content = document.getElementById('admin-content');
      
      // Calculate statistics
      const totalYears = timeline.length > 0 ? 
        Math.max(...timeline.map(t => parseInt(t.year))) - Math.min(...timeline.map(t => parseInt(t.year))) + 1 : 0;
      
      const decades = timeline.length > 0 ? 
        new Set(timeline.map(t => Math.floor(parseInt(t.year) / 10) * 10)).size : 0;
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>Timeline Management</h2>
            <p>Manage your company's history and key milestones chronologically</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary" onclick="AdminApp.previewTimeline()">
              <i class="ri-eye-line"></i> Preview on Website
            </button>
            <button class="btn btn-solid" onclick="AdminApp.showTimelineModal()">
              <i class="ri-add-line"></i> Add Milestone
            </button>
          </div>
        </div>

        <!-- Enhanced Stats Overview -->
        <div class="stats-overview-grid">
          <div class="overview-card" style="--accent: #64b5f6;">
            <i class="ri-time-line"></i>
            <div>
              <div class="overview-value">${timeline.length}</div>
              <div class="overview-label">Total Milestones</div>
            </div>
          </div>
          <div class="overview-card" style="--accent: #81c784;">
            <i class="ri-calendar-line"></i>
            <div>
              <div class="overview-value">${timeline.length > 0 ? Math.min(...timeline.map(t => parseInt(t.year))) : 'N/A'}</div>
              <div class="overview-label">First Year</div>
            </div>
          </div>
          <div class="overview-card" style="--accent: #ffb74d;">
            <i class="ri-calendar-check-line"></i>
            <div>
              <div class="overview-value">${timeline.length > 0 ? Math.max(...timeline.map(t => parseInt(t.year))) : 'N/A'}</div>
              <div class="overview-label">Latest Year</div>
            </div>
          </div>
          <div class="overview-card" style="--accent: #ba68c8;">
            <i class="ri-history-line"></i>
            <div>
              <div class="overview-value">${totalYears > 0 ? totalYears : 'N/A'}</div>
              <div class="overview-label">Years Span</div>
            </div>
          </div>
        </div>

        ${timeline.length > 0 ? `
          <!-- Timeline Visualization -->
          <div class="timeline-container">
            <div class="timeline-controls">
              <button class="timeline-view-btn active" data-view="visual" onclick="AdminApp.switchTimelineView('visual')">
                <i class="ri-git-commit-line"></i> Visual Timeline
              </button>
              <button class="timeline-view-btn" data-view="list" onclick="AdminApp.switchTimelineView('list')">
                <i class="ri-list-check"></i> List View
              </button>
              <button class="timeline-view-btn" data-view="grid" onclick="AdminApp.switchTimelineView('grid')">
                <i class="ri-grid-line"></i> Grid View
              </button>
            </div>

            <!-- Visual Timeline View -->
            <div class="timeline-view" id="timeline-visual-view">
              <div class="timeline-visual">
                ${sortedTimeline.map((item, index) => `
                  <div class="timeline-milestone" data-year="${item.year}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-line"></div>
                    <div class="timeline-card">
                      <div class="timeline-card-header">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-actions">
                          <button class="icon-btn-mini" onclick="AdminApp.editTimeline(${index})" title="Edit">
                            <i class="ri-edit-line"></i>
                          </button>
                          <button class="icon-btn-mini delete" onclick="AdminApp.deleteTimeline(${index})" title="Delete">
                            <i class="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      <h3 class="timeline-title">${item.title}</h3>
                      <p class="timeline-description">${item.description}</p>
                      <div class="timeline-meta">
                        <span class="timeline-badge">Milestone ${index + 1}</span>
                        <span class="timeline-decade">${Math.floor(parseInt(item.year) / 10) * 10}s</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- List View -->
            <div class="timeline-view" id="timeline-list-view" style="display: none;">
              <div class="timeline-list">
                ${sortedTimeline.map((item, index) => `
                  <div class="timeline-list-item">
                    <div class="timeline-list-year">${item.year}</div>
                    <div class="timeline-list-content">
                      <h3>${item.title}</h3>
                      <p>${item.description}</p>
                    </div>
                    <div class="timeline-list-actions">
                      <button class="icon-btn" onclick="AdminApp.editTimeline(${index})">
                        <i class="ri-edit-line"></i>
                      </button>
                      <button class="icon-btn delete" onclick="AdminApp.deleteTimeline(${index})">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Grid View -->
            <div class="timeline-view" id="timeline-grid-view" style="display: none;">
              <div class="timeline-grid">
                ${sortedTimeline.map((item, index) => `
                  <div class="timeline-grid-card">
                    <div class="timeline-grid-year">${item.year}</div>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="timeline-grid-actions">
                      <button class="icon-btn" onclick="AdminApp.editTimeline(${index})">
                        <i class="ri-edit-line"></i>
                      </button>
                      <button class="icon-btn delete" onclick="AdminApp.deleteTimeline(${index})">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Timeline Tips -->
          <div class="tips-card">
            <h3><i class="ri-lightbulb-line"></i> Timeline Management Tips</h3>
            <div class="tips-grid">
              <div class="tip-item">
                <i class="ri-check-line"></i>
                <span>Order milestones chronologically by year</span>
              </div>
              <div class="tip-item">
                <i class="ri-check-line"></i>
                <span>Keep titles concise (3-7 words)</span>
              </div>
              <div class="tip-item">
                <i class="ri-check-line"></i>
                <span>Descriptions should be 1-2 sentences</span>
              </div>
              <div class="tip-item">
                <i class="ri-check-line"></i>
                <span>Focus on significant company achievements</span>
              </div>
              <div class="tip-item">
                <i class="ri-check-line"></i>
                <span>Use consistent year format (YYYY)</span>
              </div>
              <div class="tip-item">
                <i class="ri-check-line"></i>
                <span>Update regularly with new milestones</span>
              </div>
            </div>
          </div>
        ` : `
          <div class="content-section">
            <div class="empty-state-large">
              <i class="ri-time-line"></i>
              <h3>No Timeline Milestones Yet</h3>
              <p>Start building your company's story by adding your first milestone</p>
              <button class="btn btn-solid" onclick="AdminApp.showTimelineModal()">
                <i class="ri-add-line"></i> Add First Milestone
              </button>
            </div>
          </div>
        `}
      `;
      
    } catch (error) {
      console.error('Error loading timeline:', error);
      this.showAlert('Error loading timeline: ' + error.message, 'error');
    }
  },

  // Switch between timeline views
  switchTimelineView(view) {
    // Hide all views
    document.querySelectorAll('.timeline-view').forEach(v => v.style.display = 'none');
    
    // Show selected view
    document.getElementById(`timeline-${view}-view`).style.display = 'block';
    
    // Update active button
    document.querySelectorAll('.timeline-view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
  },

  // Preview timeline on website
  previewTimeline() {
    window.open('../about.html#timeline', '_blank');
  },

  showTimelineModal(item = null, index = null) {
    const isEdit = item !== null;
    const currentYear = new Date().getFullYear();
    
    const modalHTML = `
      <div class="modal-overlay" id="timeline-modal" onclick="AdminApp.closeTimelineModal(event)">
        <div class="modal-container modal-large" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="ri-time-line"></i> ${isEdit ? 'Edit' : 'Add'} Milestone</h3>
            <button class="modal-close" onclick="AdminApp.closeTimelineModal()">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <form id="timeline-form" class="modal-form">
            <div class="form-group">
              <label><i class="ri-calendar-line"></i> Year</label>
              <input 
                type="number" 
                name="year" 
                value="${item?.year || currentYear}" 
                placeholder="${currentYear}" 
                min="1900" 
                max="${currentYear + 10}" 
                required
              >
              <small>Enter the year this milestone occurred (${1900}-${currentYear + 10})</small>
            </div>
            
            <div class="form-group">
              <label><i class="ri-text"></i> Milestone Title</label>
              <input 
                type="text" 
                name="title" 
                value="${item?.title || ''}" 
                placeholder="e.g., Studio Founded, First Major Project, Award Received" 
                required
                maxlength="100"
              >
              <small>Brief, descriptive title for this milestone (max 100 characters)</small>
            </div>
            
            <div class="form-group">
              <label><i class="ri-file-text-line"></i> Description</label>
              <textarea 
                name="description" 
                rows="4" 
                placeholder="Describe this milestone and its significance to your company's history..." 
                required
                maxlength="300"
              >${item?.description || ''}</textarea>
              <small>
                <span id="char-count">${(item?.description || '').length}</span>/300 characters
              </small>
            </div>

            <div class="form-preview">
              <h4><i class="ri-eye-line"></i> Preview</h4>
              <div class="preview-timeline-card">
                <div class="preview-year" id="preview-year">${item?.year || currentYear}</div>
                <h3 id="preview-title">${item?.title || 'Milestone Title'}</h3>
                <p id="preview-description">${item?.description || 'Milestone description will appear here...'}</p>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Milestone
              </button>
              <button type="button" class="btn btn-secondary" onclick="AdminApp.closeTimelineModal()">
                <i class="ri-close-line"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize form with live preview
    const form = document.getElementById('timeline-form');
    const yearInput = form.querySelector('[name="year"]');
    const titleInput = form.querySelector('[name="title"]');
    const descInput = form.querySelector('[name="description"]');
    
    // Live preview updates
    yearInput.addEventListener('input', (e) => {
      document.getElementById('preview-year').textContent = e.target.value || currentYear;
    });
    
    titleInput.addEventListener('input', (e) => {
      document.getElementById('preview-title').textContent = e.target.value || 'Milestone Title';
    });
    
    descInput.addEventListener('input', (e) => {
      document.getElementById('preview-description').textContent = e.target.value || 'Milestone description will appear here...';
      document.getElementById('char-count').textContent = e.target.value.length;
      
      // Warn if approaching limit
      if (e.target.value.length > 270) {
        document.getElementById('char-count').style.color = '#e57373';
      } else {
        document.getElementById('char-count').style.color = 'var(--muted)';
      }
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTimeline(new FormData(e.target), index);
    });
  },

  closeTimelineModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('timeline-modal');
    if (modal) modal.remove();
  },

  saveTimeline(formData, index) {
    try {
      const timeline = AdminData.getSection('timeline') || [];
      const timelineData = {
        year: formData.get('year'),
        title: formData.get('title'),
        description: formData.get('description')
      };
      
      if (index !== null) {
        timeline[index] = timelineData;
        this.showAlert('Milestone updated successfully!', 'success');
      } else {
        timeline.push(timelineData);
        this.showAlert('Milestone added successfully!', 'success');
      }
      
      AdminData.updateSection('timeline', timeline);
      this.closeTimelineModal();
      this.loadTimelineSection();
    } catch (error) {
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },

  editTimeline(index) {
    const timeline = AdminData.getSection('timeline') || [];
    this.showTimelineModal(timeline[index], index);
  },

  deleteTimeline(index) {
    if (confirm('Are you sure you want to delete this milestone?')) {
      const timeline = AdminData.getSection('timeline') || [];
      timeline.splice(index, 1);
      AdminData.updateSection('timeline', timeline);
      this.showAlert('Milestone deleted successfully!', 'success');
      this.loadTimelineSection();
    }
  },
  loadContactSection() {
    try {
      const contact = AdminData.getSection('contact') || {};
      const content = document.getElementById('admin-content');
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>Contact Information</h2>
            <p>Manage your studio's contact details</p>
          </div>
        </div>

        <div class="contact-management-grid">
          <div class="contact-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Address Information</h3>
                <p>Physical location details</p>
              </div>
              <i class="ri-map-pin-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>
            <form id="address-form" class="contact-form">
              <div class="form-group">
                <label><i class="ri-map-pin-line"></i> Street Address</label>
                <input type="text" name="address" value="${contact.address || ''}" required>
              </div>
              <div class="form-group">
                <label><i class="ri-building-line"></i> City</label>
                <input type="text" name="city" value="${contact.city || ''}" required>
              </div>
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> Update Address
              </button>
            </form>
          </div>

          <div class="contact-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Phone Numbers</h3>
                <p>Contact phone numbers</p>
              </div>
              <i class="ri-phone-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>
            <form id="phone-form" class="contact-form">
              <div class="form-group">
                <label><i class="ri-phone-line"></i> Primary Phone</label>
                <input type="tel" name="phone1" value="${contact.phones?.[0] || ''}" required>
              </div>
              <div class="form-group">
                <label><i class="ri-phone-line"></i> Secondary Phone</label>
                <input type="tel" name="phone2" value="${contact.phones?.[1] || ''}">
              </div>
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> Update Phones
              </button>
            </form>
          </div>

          <div class="contact-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Email Information</h3>
                <p>Email address and response time</p>
              </div>
              <i class="ri-mail-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>
            <form id="email-form" class="contact-form">
              <div class="form-group">
                <label><i class="ri-mail-line"></i> Email Address</label>
                <input type="email" name="email" value="${contact.email || ''}" required>
              </div>
              <div class="form-group">
                <label><i class="ri-information-line"></i> Response Time Note</label>
                <input type="text" name="emailNote" value="${contact.emailNote || ''}" placeholder="Response within 2 business days">
              </div>
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> Update Email
              </button>
            </form>
          </div>

          <div class="contact-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Business Hours</h3>
                <p>Operating hours information</p>
              </div>
              <i class="ri-time-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>
            <form id="hours-form" class="contact-form">
              <div class="form-group">
                <label><i class="ri-calendar-line"></i> Days</label>
                <input type="text" name="hours" value="${contact.hours || ''}" placeholder="Mon – Fri" required>
              </div>
              <div class="form-group">
                <label><i class="ri-time-line"></i> Hours</label>
                <input type="text" name="hoursDetail" value="${contact.hoursDetail || ''}" placeholder="8:30 AM – 6:00 PM" required>
              </div>
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> Update Hours
              </button>
            </form>
          </div>

          <div class="contact-card social-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Social Media Links</h3>
                <p>Connect your social profiles</p>
              </div>
              <i class="ri-share-line" style="font-size: 1.5rem; color: var(--gold);"></i>
            </div>
            <form id="social-form" class="contact-form">
              <div class="form-group">
                <label><i class="ri-instagram-line"></i> Instagram</label>
                <input type="url" name="instagram" value="${contact.social?.instagram || ''}" placeholder="https://instagram.com/yourstudio">
              </div>
              <div class="form-group">
                <label><i class="ri-linkedin-line"></i> LinkedIn</label>
                <input type="url" name="linkedin" value="${contact.social?.linkedin || ''}" placeholder="https://linkedin.com/company/yourstudio">
              </div>
              <div class="form-group">
                <label><i class="ri-telegram-line"></i> Telegram</label>
                <input type="url" name="telegram" value="${contact.social?.telegram || ''}" placeholder="https://t.me/yourstudio">
              </div>
              <button type="submit" class="btn btn-solid">
                <i class="ri-save-line"></i> Update Social Links
              </button>
            </form>
          </div>

          <div class="contact-preview-card">
            <div class="card-header-enhanced">
              <div>
                <h3>Contact Information Preview</h3>
                <p>How it appears on your website</p>
              </div>
            </div>
            <div class="contact-preview">
              <div class="preview-item">
                <i class="ri-map-pin-line"></i>
                <div>
                  <strong>${contact.address || 'Not set'}</strong>
                  <span>${contact.city || 'Not set'}</span>
                </div>
              </div>
              <div class="preview-item">
                <i class="ri-phone-line"></i>
                <div>
                  <strong>${contact.phones?.[0] || 'Not set'}</strong>
                  ${contact.phones?.[1] ? `<span>${contact.phones[1]}</span>` : ''}
                </div>
              </div>
              <div class="preview-item">
                <i class="ri-mail-line"></i>
                <div>
                  <strong>${contact.email || 'Not set'}</strong>
                  <span>${contact.emailNote || ''}</span>
                </div>
              </div>
              <div class="preview-item">
                <i class="ri-time-line"></i>
                <div>
                  <strong>${contact.hours || 'Not set'}</strong>
                  <span>${contact.hoursDetail || ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Initialize forms
      this.initContactForms();
      
    } catch (error) {
      console.error('Error loading contact section:', error);
      this.showAlert('Error loading contact info: ' + error.message, 'error');
    }
  },

  initContactForms() {
    const forms = ['address', 'phone', 'email', 'hours', 'social'];
    
    forms.forEach(formType => {
      const form = document.getElementById(`${formType}-form`);
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveContactInfo(formType, new FormData(e.target));
        });
      }
    });
  },

  saveContactInfo(type, formData) {
    try {
      const contact = AdminData.getSection('contact') || {};
      
      switch(type) {
        case 'address':
          contact.address = formData.get('address');
          contact.city = formData.get('city');
          break;
        case 'phone':
          contact.phones = [formData.get('phone1'), formData.get('phone2')].filter(p => p);
          break;
        case 'email':
          contact.email = formData.get('email');
          contact.emailNote = formData.get('emailNote');
          break;
        case 'hours':
          contact.hours = formData.get('hours');
          contact.hoursDetail = formData.get('hoursDetail');
          break;
        case 'social':
          contact.social = {
            instagram: formData.get('instagram') || '#',
            linkedin: formData.get('linkedin') || '#',
            telegram: formData.get('telegram') || '#'
          };
          break;
      }
      
      AdminData.updateSection('contact', contact);
      this.showAlert('Contact information updated successfully!', 'success');
      setTimeout(() => this.loadContactSection(), 1000);
      
    } catch (error) {
      this.showAlert('Error saving: ' + error.message, 'error');
    }
  },
  loadImagesSection() {
    try {
      const content = document.getElementById('admin-content');
      
      // Get all images used in the website
      const images = [
        { name: 'hero-residence.jpeg', path: 'images/hero-residence.jpeg', usage: 'Hero Section' },
        { name: 'about-mansion.jpeg', path: 'images/about-mansion.jpeg', usage: 'About Page' },
        { name: 'project-bole.jpeg', path: 'images/project-bole.jpeg', usage: 'Projects' },
        { name: 'project-entoto.jpeg', path: 'images/project-entoto.jpeg', usage: 'Projects' },
        { name: 'project-kebena.jpeg', path: 'images/project-kebena.jpeg', usage: 'Projects' },
        { name: 'project-mercato.jpeg', path: 'images/project-mercato.jpeg', usage: 'Projects' },
        { name: 'project-piassa.jpeg', path: 'images/project-piassa.jpeg', usage: 'Projects' },
        { name: 'project-sarbet.jpeg', path: 'images/project-sarbet.jpeg', usage: 'Projects' }
      ];
      
      content.innerHTML = `
        <div class="section-page-header">
          <div>
            <h2>Images Management</h2>
            <p>Manage all images used throughout your website</p>
          </div>
          <button class="btn btn-solid" onclick="AdminApp.showImageUploader()">
            <i class="ri-upload-2-line"></i> Upload Image
          </button>
        </div>

        <div class="stats-overview-grid">
          <div class="overview-card">
            <i class="ri-image-line"></i>
            <div>
              <div class="overview-value">${images.length}</div>
              <div class="overview-label">Total Images</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-folder-line"></i>
            <div>
              <div class="overview-value">images/</div>
              <div class="overview-label">Storage Location</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-file-list-line"></i>
            <div>
              <div class="overview-value">JPEG</div>
              <div class="overview-label">Primary Format</div>
            </div>
          </div>
          <div class="overview-card">
            <i class="ri-check-line"></i>
            <div>
              <div class="overview-value">Optimized</div>
              <div class="overview-label">Status</div>
            </div>
          </div>
        </div>

        <div class="images-gallery">
          <div class="images-grid">
            ${images.map(image => `
              <div class="image-item">
                <img src="../${image.path}" alt="${image.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%23222%22 width=%22200%22 height=%22150%22/%3E%3Ctext fill=%22%23666%22 font-family=%22monospace%22 font-size=%2212%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22%3EImage Not Found%3C/text%3E%3C/svg%3E'">
                <div class="image-item-overlay">
                  <div class="image-item-name">${image.name}</div>
                  <small style="color: var(--muted); font-size: .75rem;">${image.usage}</small>
                  <div class="image-item-actions">
                    <button class="icon-btn" onclick="window.open('../${image.path}', '_blank')" title="View Full Size">
                      <i class="ri-eye-line"></i>
                    </button>
                    <button class="icon-btn" onclick="navigator.clipboard.writeText('${image.path}'); AdminApp.showAlert('Path copied to clipboard!', 'success');" title="Copy Path">
                      <i class="ri-file-copy-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="images-guidelines">
            <h4><i class="ri-information-line"></i> Image Management Guidelines</h4>
            <ul>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>File Format:</strong> Use JPEG for photos, PNG for graphics with transparency, WebP for modern browsers</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>Recommended Size:</strong> Hero images: 1920x1080px, Project images: 1200x800px, Thumbnails: 400x300px</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>File Size:</strong> Keep images under 500KB for optimal loading. Use compression tools before uploading</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>Naming Convention:</strong> Use descriptive names with hyphens (e.g., project-name-exterior.jpeg)</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>Storage Location:</strong> All images are stored in the /images directory at the root of your website</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>Alt Text:</strong> Always provide descriptive alt text for accessibility when adding images to content</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>Backup:</strong> Keep original high-resolution versions of all images in a separate backup location</span>
              </li>
              <li>
                <i class="ri-arrow-right-s-line"></i>
                <span><strong>Updating Images:</strong> To replace an image, upload a new file with the same name, or update references in the code</span>
              </li>
            </ul>
          </div>
        </div>
      `;
      
    } catch (error) {
      console.error('Error loading images section:', error);
      this.showAlert('Error loading images section: ' + error.message, 'error');
    }
  },

  showImageUploader() {
    const modalHTML = `
      <div class="modal-overlay" id="image-upload-modal" onclick="AdminApp.closeImageModal(event)">
        <div class="modal-container modal-large" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="ri-upload-2-line"></i> Upload Image</h3>
            <button class="modal-close" onclick="AdminApp.closeImageModal()">
              <i class="ri-close-line"></i>
            </button>
          </div>
          <div class="modal-form">
            <div class="upload-area" onclick="document.getElementById('file-input').click()">
              <i class="ri-upload-cloud-line"></i>
              <h3>Click to Upload</h3>
              <p>Drag and drop or click to select images</p>
              <small style="color: var(--muted); margin-top: .5rem;">Supported formats: JPG, PNG, WebP (Max 5MB)</small>
            </div>
            <input type="file" id="file-input" accept="image/*" multiple style="display: none;" onchange="AdminApp.handleImageUpload(event)">
            
            <div class="alert alert-info" style="margin-top: 1.5rem;">
              <i class="ri-information-line"></i>
              <span><strong>Note:</strong> This is a demo interface. In a production environment, uploaded images would be stored on your server. For now, manually add images to the /images folder and update references in your code.</span>
            </div>

            <div class="modal-actions">
              <button class="btn btn-secondary" onclick="AdminApp.closeImageModal()">
                <i class="ri-close-line"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  handleImageUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    let validCount = 0;
    let errorMessages = [];

    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errorMessages.push(`${file.name}: Not an image file`);
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        errorMessages.push(`${file.name}: File size exceeds 5MB`);
        return;
      }

      validCount++;
    });

    if (errorMessages.length > 0) {
      this.showAlert(errorMessages.join('<br>'), 'error');
    }

    if (validCount > 0) {
      this.showAlert(`${validCount} image(s) ready for upload. In production, these would be uploaded to your server. For now, manually add them to the /images folder.`, 'info');
    }
  },

  closeImageModal(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('image-upload-modal');
    if (modal) modal.remove();
  },
  editProject(index) {
    this.showAlert('Edit project feature coming soon...', 'info');
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOM loaded, checking environment...');
    
    // Check if we're on admin page (not login)
    const isAdminPage = window.location.pathname.includes('admin') && 
                       !window.location.pathname.includes('login');
    
    if (isAdminPage) {
      console.log('Admin page detected');
      
      // Wait for dependencies to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure AdminData exists and is initialized
      if (typeof AdminData !== 'undefined') {
        console.log('AdminData found, initializing...');
        await AdminData.init();
        
        // Check if data exists
        const data = await AdminData.getData();
        if (!data || Object.keys(data).length === 0) {
          console.log('No data, creating defaults...');
          await AdminData.resetToDefaults();
        }
      } else {
        console.error('AdminData not found!');
      }
      
      // Initialize the app
      setTimeout(() => {
        AdminApp.init();
      }, 100);
    }
  } catch (error) {
    console.error('Fatal error during initialization:', error);
  }
});
