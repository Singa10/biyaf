// Main Admin Application - Fixed Version
const AdminApp = {
  currentSection: 'dashboard',

  init() {
    try {
      console.log('AdminApp initializing...');
      
      // Hide loading indicator
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      
      this.initUI();
      this.initTheme();
      this.loadDashboard();
      
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
  loadDashboard() {
    try {
      console.log('Loading dashboard...');
      
      const data = AdminData.getData();
      console.log('Data loaded:', data);
      
      if (!data || Object.keys(data).length === 0) {
        console.log('No data found, initializing defaults...');
        AdminData.resetToDefaults();
        const newData = AdminData.getData();
        console.log('Default data created:', newData);
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

  // Placeholder for other sections
  loadHeroSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Hero section coming soon...</span></div>';
  },
  loadStatsSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Stats section coming soon...</span></div>';
  },
  loadProjectsSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Projects section coming soon...</span></div>';
  },
  loadServicesSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Services section coming soon...</span></div>';
  },
  loadAboutSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>About section coming soon...</span></div>';
  },
  loadTimelineSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Timeline section coming soon...</span></div>';
  },
  loadContactSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Contact section coming soon...</span></div>';
  },
  loadImagesSection() {
    document.getElementById('admin-content').innerHTML = '<div class="alert alert-info"><i class="ri-information-line"></i><span>Images section coming soon...</span></div>';
  },
  editProject(index) {
    this.showAlert('Edit project feature coming soon...', 'info');
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM loaded, checking environment...');
    
    // Check if we're on admin page (not login)
    const isAdminPage = window.location.pathname.includes('admin') && 
                       !window.location.pathname.includes('login');
    
    if (isAdminPage) {
      console.log('Admin page detected');
      
      // Ensure AdminData exists and is initialized
      if (typeof AdminData !== 'undefined') {
        console.log('AdminData found, initializing...');
        AdminData.init();
        
        // Check if data exists
        const data = AdminData.getData();
        if (!data || Object.keys(data).length === 0) {
          console.log('No data, creating defaults...');
          AdminData.resetToDefaults();
        }
      } else {
        console.error('AdminData not found!');
      }
      
      // Initialize the app
      setTimeout(() => {
        AdminApp.init();
      }, 500);
    }
  } catch (error) {
    console.error('Fatal error during initialization:', error);
  }
});
