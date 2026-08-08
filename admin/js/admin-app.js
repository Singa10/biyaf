// Main Admin Application
const AdminApp = {
  currentSection: 'dashboard',

  init() {
    console.log('AdminApp initializing...');
    
    // Hide loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
    this.initUI();
    this.initTheme();
    
    // Load dashboard after a small delay to ensure everything is ready
    setTimeout(() => {
      console.log('Loading dashboard...');
      this.loadDashboard();
    }, 200);
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
        document.getElementById('page-title').textContent = link.querySelector('span').textContent;
      });
    });

    // Logout button
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        AdminAuth.logout();
      }
    });

    // Mobile toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle) {
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
    this.currentSection = section;
    const content = document.getElementById('admin-content');
    
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
  },

  // Show alert
  showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'ri-checkbox-circle-line' : 
                 type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
    
    alert.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    
    const content = document.getElementById('admin-content');
    content.insertBefore(alert, content.firstChild);
    
    setTimeout(() => alert.remove(), 4000);
  },

  // Load Dashboard
  loadDashboard() {
    console.log('loadDashboard called');
    
    const data = AdminData.getData();
    console.log('Data retrieved:', data);
    
    const stats = data.stats || [];
    const projects = data.projects || [];
    const services = data.services || [];
    const timeline = data.timeline || [];
    
    console.log('Stats:', stats.length, 'Projects:', projects.length, 'Services:', services.length, 'Timeline:', timeline.length);
    
    const residentialCount = projects.filter(p => p.category === 'residential').length;
    const commercialCount = projects.filter(p => p.category === 'commercial').length;
    const publicCount = projects.filter(p => p.category === 'public').length;
    
    const recentProjects = projects.slice(-3).reverse();
    
    const content = document.getElementById('admin-content');
    
    if (!content) {
      console.error('Admin content element not found!');
      return;
    }
    
    console.log('Rendering dashboard HTML...');
    
    content.innerHTML = `
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
        ${stats.map((stat, index) => {
          const icons = ['ri-time-line', 'ri-building-line', 'ri-map-pin-line', 'ri-team-line'];
          const colors = ['#64b5f6', '#81c784', '#ffb74d', '#e57373'];
          return `
            <div class="stat-card stat-card-enhanced" style="--accent-color: ${colors[index % 4]}">
              <div class="stat-card-icon-enhanced">
                <i class="${icons[index % 4]}"></i>
              </div>
              <div class="stat-card-content">
                <div class="stat-card-value-enhanced">${stat.number}${stat.suffix}</div>
                <div class="stat-card-label-enhanced">${stat.label}</div>
              </div>
              <div class="stat-card-trend">
                <i class="ri-arrow-up-line"></i>
                <span>+${Math.floor(Math.random() * 15 + 5)}%</span>
              </div>
            </div>
          `;
        }).join('')}
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
              <div class="category-bar" style="--percentage: ${residentialCount / projects.length * 100}%; --bar-color: #64b5f6;">
                <div class="category-label">
                  <i class="ri-home-line"></i>
                  <span>Residential</span>
                </div>
                <div class="category-count">${residentialCount}</div>
              </div>
              <div class="category-bar" style="--percentage: ${commercialCount / projects.length * 100}%; --bar-color: #81c784;">
                <div class="category-label">
                  <i class="ri-store-line"></i>
                  <span>Commercial</span>
                </div>
                <div class="category-count">${commercialCount}</div>
              </div>
              <div class="category-bar" style="--percentage: ${publicCount / projects.length * 100}%; --bar-color: #ffb74d;">
                <div class="category-label">
                  <i class="ri-building-2-line"></i>
                  <span>Public</span>
                </div>
                <div class="category-count">${publicCount}</div>
              </div>
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
            ${recentProjects.length > 0 ? recentProjects.map(project => `
              <div class="recent-item">
                <div class="recent-icon" style="background: ${project.category === 'residential' ? '#64b5f6' : project.category === 'commercial' ? '#81c784' : '#ffb74d'}22; color: ${project.category === 'residential' ? '#64b5f6' : project.category === 'commercial' ? '#81c784' : '#ffb74d'};">
                  <i class="ri-building-line"></i>
                </div>
                <div class="recent-content">
                  <div class="recent-title">${project.title}</div>
                  <div class="recent-meta">${project.category} • ${project.year}</div>
                </div>
                <button class="icon-btn-small" onclick="AdminApp.editProject(${projects.indexOf(project)})">
                  <i class="ri-pencil-line"></i>
                </button>
              </div>
            `).join('') : '<div class="empty-state"><i class="ri-inbox-line"></i><p>No projects yet</p></div>'}
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
    
    console.log('Dashboard HTML rendered successfully');
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
  loadHeroSection() {
    const hero = AdminData.getSection('hero') || {};
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Hero Section</h2>
        </div>
        <form id="hero-form" class="admin-form">
          <div class="form-group">
            <label>Eyebrow Text</label>
            <input type="text" name="eyebrow" value="${hero.eyebrow || ''}" required>
          </div>
          <div class="form-group">
            <label>Main Title (use &lt;em&gt; for italic/highlighted text)</label>
            <textarea name="title" rows="3" required>${hero.title || ''}</textarea>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" required>${hero.description || ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Image Path</label>
              <input type="text" name="image" value="${hero.image || ''}" required>
            </div>
            <div class="form-group">
              <label>Image Alt Text</label>
              <input type="text" name="imageAlt" value="${hero.imageAlt || ''}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Coordinates</label>
              <input type="text" name="coordinates" value="${hero.coordinates || ''}" required>
            </div>
            <div class="form-group">
              <label>Figure Label</label>
              <input type="text" name="figureLabel" value="${hero.figureLabel || ''}" required>
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
    `;
    
    document.getElementById('hero-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const hero = Object.fromEntries(formData);
      AdminData.updateSection('hero', hero);
      this.showAlert('Hero section updated successfully!');
    });
  },

  // Load Stats Section
  loadStatsSection() {
    const stats = AdminData.getSection('stats') || [];
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Statistics</h2>
          <button class="btn btn-solid" onclick="AdminApp.addStat()">
            <i class="ri-add-line"></i> Add Stat
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Label</th>
              <th>Suffix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${stats.map((stat, index) => `
              <tr>
                <td>${stat.number}</td>
                <td>${stat.label}</td>
                <td>${stat.suffix || 'None'}</td>
                <td class="table-actions">
                  <button class="icon-btn edit" onclick="AdminApp.editStat(${index})">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="icon-btn delete" onclick="AdminApp.deleteStat(${index})">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  addStat() {
    const number = prompt('Enter number:');
    const label = prompt('Enter label:');
    const suffix = prompt('Enter suffix (optional, e.g., +):') || '';
    
    if (number && label) {
      const stats = AdminData.getSection('stats') || [];
      stats.push({ number: parseInt(number), label, suffix });
      AdminData.updateSection('stats', stats);
      this.showAlert('Stat added successfully!');
      this.loadStatsSection();
    }
  },

  editStat(index) {
    const stats = AdminData.getSection('stats') || [];
    const stat = stats[index];
    
    const number = prompt('Enter number:', stat.number);
    const label = prompt('Enter label:', stat.label);
    const suffix = prompt('Enter suffix (optional):', stat.suffix) || '';
    
    if (number && label) {
      stats[index] = { number: parseInt(number), label, suffix };
      AdminData.updateSection('stats', stats);
      this.showAlert('Stat updated successfully!');
      this.loadStatsSection();
    }
  },

  deleteStat(index) {
    if (confirm('Are you sure you want to delete this stat?')) {
      const stats = AdminData.getSection('stats') || [];
      stats.splice(index, 1);
      AdminData.updateSection('stats', stats);
      this.showAlert('Stat deleted successfully!');
      this.loadStatsSection();
    }
  },

  // Load Projects Section
  loadProjectsSection() {
    const projects = AdminData.getSection('projects') || [];
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Projects</h2>
          <button class="btn btn-solid" onclick="AdminApp.showProjectForm()">
            <i class="ri-add-line"></i> Add Project
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${projects.map((project, index) => `
              <tr>
                <td>${project.projectCode}</td>
                <td>${project.title}</td>
                <td style="text-transform: capitalize;">${project.category}</td>
                <td>${project.year}</td>
                <td class="table-actions">
                  <button class="icon-btn edit" onclick="AdminApp.editProject(${index})">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="icon-btn delete" onclick="AdminApp.deleteProject(${index})">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div id="project-form-container"></div>
    `;
  },

  showProjectForm(project = null, index = null) {
    const isEdit = project !== null;
    const container = document.getElementById('project-form-container');
    
    container.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>${isEdit ? 'Edit' : 'Add'} Project</h2>
        </div>
        <form id="project-form" class="admin-form">
          <div class="form-row">
            <div class="form-group">
              <label>Project Code</label>
              <input type="text" name="projectCode" value="${project?.projectCode || ''}" required>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" value="${project?.title || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" required>${project?.description || ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select name="category" required>
                <option value="residential" ${project?.category === 'residential' ? 'selected' : ''}>Residential</option>
                <option value="commercial" ${project?.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                <option value="public" ${project?.category === 'public' ? 'selected' : ''}>Public</option>
              </select>
            </div>
            <div class="form-group">
              <label>Year</label>
              <input type="text" name="year" value="${project?.year || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Image Path</label>
            <input type="text" name="image" value="${project?.image || ''}" required>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-solid">
              <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Project
            </button>
            <button type="button" class="btn btn-secondary" onclick="AdminApp.loadProjectsSection()">
              <i class="ri-close-line"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const projectData = Object.fromEntries(formData);
      
      const projects = AdminData.getSection('projects') || [];
      
      if (isEdit) {
        projects[index] = { ...project, ...projectData };
      } else {
        projectData.id = Date.now();
        projects.push(projectData);
      }
      
      AdminData.updateSection('projects', projects);
      this.showAlert(`Project ${isEdit ? 'updated' : 'added'} successfully!`);
      this.loadProjectsSection();
    });

    container.scrollIntoView({ behavior: 'smooth' });
  },

  editProject(index) {
    const projects = AdminData.getSection('projects') || [];
    this.showProjectForm(projects[index], index);
  },

  deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
      const projects = AdminData.getSection('projects') || [];
      projects.splice(index, 1);
      AdminData.updateSection('projects', projects);
      this.showAlert('Project deleted successfully!');
      this.loadProjectsSection();
    }
  },

  // Load Services Section
  loadServicesSection() {
    const services = AdminData.getSection('services') || [];
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Services</h2>
          <button class="btn btn-solid" onclick="AdminApp.showServiceForm()">
            <i class="ri-add-line"></i> Add Service
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${services.map((service, index) => `
              <tr>
                <td>${service.number}</td>
                <td>${service.title}</td>
                <td>${service.description.substring(0, 80)}...</td>
                <td class="table-actions">
                  <button class="icon-btn edit" onclick="AdminApp.editService(${index})">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="icon-btn delete" onclick="AdminApp.deleteService(${index})">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div id="service-form-container"></div>
    `;
  },

  showServiceForm(service = null, index = null) {
    const isEdit = service !== null;
    const container = document.getElementById('service-form-container');
    
    container.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>${isEdit ? 'Edit' : 'Add'} Service</h2>
        </div>
        <form id="service-form" class="admin-form">
          <div class="form-row">
            <div class="form-group">
              <label>Service Number (e.g., A—01)</label>
              <input type="text" name="number" value="${service?.number || ''}" required>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" value="${service?.title || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" required>${service?.description || ''}</textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-solid">
              <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Service
            </button>
            <button type="button" class="btn btn-secondary" onclick="AdminApp.loadServicesSection()">
              <i class="ri-close-line"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('service-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const serviceData = Object.fromEntries(formData);
      
      const services = AdminData.getSection('services') || [];
      
      if (isEdit) {
        services[index] = { ...service, ...serviceData };
      } else {
        serviceData.id = Date.now();
        services.push(serviceData);
      }
      
      AdminData.updateSection('services', services);
      this.showAlert(`Service ${isEdit ? 'updated' : 'added'} successfully!`);
      this.loadServicesSection();
    });

    container.scrollIntoView({ behavior: 'smooth' });
  },

  editService(index) {
    const services = AdminData.getSection('services') || [];
    this.showServiceForm(services[index], index);
  },

  deleteService(index) {
    if (confirm('Are you sure you want to delete this service?')) {
      const services = AdminData.getSection('services') || [];
      services.splice(index, 1);
      AdminData.updateSection('services', services);
      this.showAlert('Service deleted successfully!');
      this.loadServicesSection();
    }
  },

  // Placeholder sections (implement similar to above)
  loadAboutSection() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>About Us Content</h2>
        </div>
        <div class="alert alert-info">
          <i class="ri-information-line"></i>
          <span>About page content management coming soon. You can edit content directly in about.html for now.</span>
        </div>
      </div>
    `;
  },

  loadTimelineSection() {
    const timeline = AdminData.getSection('timeline') || [];
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Timeline</h2>
          <button class="btn btn-solid" onclick="AdminApp.showTimelineForm()">
            <i class="ri-add-line"></i> Add Milestone
          </button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${timeline.map((item, index) => `
              <tr>
                <td>${item.year}</td>
                <td>${item.title}</td>
                <td>${item.description.substring(0, 60)}...</td>
                <td class="table-actions">
                  <button class="icon-btn edit" onclick="AdminApp.editTimeline(${index})">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="icon-btn delete" onclick="AdminApp.deleteTimeline(${index})">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div id="timeline-form-container"></div>
    `;
  },

  showTimelineForm(item = null, index = null) {
    const isEdit = item !== null;
    const container = document.getElementById('timeline-form-container');
    
    container.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>${isEdit ? 'Edit' : 'Add'} Timeline Milestone</h2>
        </div>
        <form id="timeline-form" class="admin-form">
          <div class="form-row">
            <div class="form-group">
              <label>Year</label>
              <input type="text" name="year" value="${item?.year || ''}" required>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" value="${item?.title || ''}" required>
            </div>
          </div>

  showTimelineForm(item = null, index = null) {
    const isEdit = item !== null;
    const container = document.getElementById('timeline-form-container');
    
    container.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>${isEdit ? 'Edit' : 'Add'} Timeline Milestone</h2>
        </div>
        <form id="timeline-form" class="admin-form">
          <div class="form-row">
            <div class="form-group">
              <label>Year</label>
              <input type="text" name="year" value="${item?.year || ''}" required>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" value="${item?.title || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" required>${item?.description || ''}</textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-solid">
              <i class="ri-save-line"></i> ${isEdit ? 'Update' : 'Add'} Milestone
            </button>
            <button type="button" class="btn btn-secondary" onclick="AdminApp.loadTimelineSection()">
              <i class="ri-close-line"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('timeline-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const timelineData = Object.fromEntries(formData);
      
      const timeline = AdminData.getSection('timeline') || [];
      
      if (isEdit) {
        timeline[index] = timelineData;
      } else {
        timeline.push(timelineData);
      }
      
      AdminData.updateSection('timeline', timeline);
      this.showAlert(`Timeline milestone ${isEdit ? 'updated' : 'added'} successfully!`);
      this.loadTimelineSection();
    });

    container.scrollIntoView({ behavior: 'smooth' });
  },

  editTimeline(index) {
    const timeline = AdminData.getSection('timeline') || [];
    this.showTimelineForm(timeline[index], index);
  },

  deleteTimeline(index) {
    if (confirm('Are you sure you want to delete this milestone?')) {
      const timeline = AdminData.getSection('timeline') || [];
      timeline.splice(index, 1);
      AdminData.updateSection('timeline', timeline);
      this.showAlert('Timeline milestone deleted successfully!');
      this.loadTimelineSection();
    }
  },

  loadContactSection() {
    const contact = AdminData.getSection('contact') || {};
    const content = document.getElementById('admin-content');
    
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Contact Information</h2>
        </div>
        <form id="contact-form" class="admin-form">
          <div class="form-group">
            <label>Address</label>
            <input type="text" name="address" value="${contact.address || ''}" required>
          </div>
          <div class="form-group">
            <label>City</label>
            <input type="text" name="city" value="${contact.city || ''}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone 1</label>
              <input type="text" name="phone1" value="${contact.phones?.[0] || ''}" required>
            </div>
            <div class="form-group">
              <label>Phone 2</label>
              <input type="text" name="phone2" value="${contact.phones?.[1] || ''}">
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="${contact.email || ''}" required>
          </div>
          <div class="form-group">
            <label>Email Note</label>
            <input type="text" name="emailNote" value="${contact.emailNote || ''}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Hours</label>
              <input type="text" name="hours" value="${contact.hours || ''}" required>
            </div>
            <div class="form-group">
              <label>Hours Detail</label>
              <input type="text" name="hoursDetail" value="${contact.hoursDetail || ''}" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-solid">
              <i class="ri-save-line"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.getElementById('contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const contactData = {
        address: formData.get('address'),
        city: formData.get('city'),
        phones: [formData.get('phone1'), formData.get('phone2')].filter(p => p),
        email: formData.get('email'),
        emailNote: formData.get('emailNote'),
        hours: formData.get('hours'),
        hoursDetail: formData.get('hoursDetail'),
        social: contact.social || { instagram: '#', linkedin: '#', telegram: '#' }
      };
      
      AdminData.updateSection('contact', contactData);
      this.showAlert('Contact information updated successfully!');
    });
  },

  loadImagesSection() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
      <div class="content-section">
        <div class="section-header">
          <h2>Image Management</h2>
        </div>
        <div class="alert alert-info">
          <i class="ri-information-line"></i>
          <span>Image management requires file upload capabilities. Currently, you can specify image paths in each section's forms. Upload images to the /images folder manually.</span>
        </div>
        <div class="image-upload-area">
          <i class="ri-image-add-line"></i>
          <h3>Upload Images</h3>
          <p>Place your images in the <code>/images</code> folder, then reference them in the admin forms.</p>
        </div>
      </div>
    `;
  }
};

// Initialize admin app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize data first
  AdminData.init();
  
  // Check if we have data, if not reset to defaults
  const currentData = AdminData.getData();
  if (!currentData || Object.keys(currentData).length === 0) {
    console.log('No data found, initializing with defaults...');
    AdminData.resetToDefaults();
  }
  
  // Then initialize admin app
  if (window.location.pathname.includes('admin') && !window.location.pathname.includes('login')) {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
      AdminApp.init();
    }, 100);
  }
});
