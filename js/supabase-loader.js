// Frontend Supabase Data Loader - Loads admin data from Supabase into website pages
const SupabaseFrontendLoader = {
  // Get data from Supabase
  async getData() {
    try {
      const client = window.SupabaseClient.get();
      if (!client) {
        console.error('Supabase client not available');
        return null;
      }

      const { data, error } = await client
        .from('website_content')
        .select('*')
        .order('section', { ascending: true });
      
      if (error) {
        console.error('Error loading data from Supabase:', error);
        return null;
      }
      
      // Convert array to object
      const dataObject = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          dataObject[item.section] = item.content;
        });
      }
      
      return dataObject;
    } catch (error) {
      console.error('Error in getData:', error);
      return null;
    }
  },

  // Load Hero Section
  async loadHeroSection() {
    const data = await this.getData();
    if (!data || !data.hero) return;

    const hero = data.hero;
    
    // Update eyebrow text
    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow && hero.eyebrow) {
      eyebrow.textContent = hero.eyebrow;
    }

    // Update title
    const title = document.querySelector('.hero-title');
    if (title && hero.title) {
      title.innerHTML = hero.title;
    }

    // Update description
    const description = document.querySelector('.hero-description');
    if (description && hero.description) {
      description.textContent = hero.description;
    }

    // Update hero image
    const heroImage = document.querySelector('.hero-image-wrapper img');
    if (heroImage && hero.image) {
      heroImage.src = hero.image;
      if (hero.imageAlt) {
        heroImage.alt = hero.imageAlt;
      }
    }

    // Update coordinates
    const coordinates = document.querySelector('.hero-coordinates');
    if (coordinates && hero.coordinates) {
      coordinates.textContent = hero.coordinates;
    }

    // Update figure label
    const figureLabel = document.querySelector('.hero-figure');
    if (figureLabel && hero.figureLabel) {
      figureLabel.textContent = hero.figureLabel;
    }

    console.log('✅ Hero section loaded from Supabase');
  },

  // Load Statistics
  async loadStatistics() {
    const data = await this.getData();
    if (!data || !data.stats || !data.stats.length) return;

    const statsContainer = document.querySelector('.stats-grid');
    if (!statsContainer) return;

    const icons = ['ri-time-line', 'ri-building-line', 'ri-map-pin-line', 'ri-team-line'];
    
    statsContainer.innerHTML = data.stats.map((stat, index) => `
      <div class="stat-card">
        <i class="${icons[index % 4]}"></i>
        <div class="stat-number">${stat.number}${stat.suffix || ''}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');

    console.log('✅ Statistics loaded from Supabase');
  },

  // Load Projects
  async loadProjects() {
    const data = await this.getData();
    if (!data || !data.projects || !data.projects.length) return;

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = data.projects.map(project => `
      <div class="project-card" data-category="${project.category}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </div>
        <div class="project-content">
          <div class="project-meta">
            <span class="project-code">${project.projectCode}</span>
            <span class="project-category">${project.category}</span>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-year">${project.year}</div>
        </div>
      </div>
    `).join('');

    console.log('✅ Projects loaded from Supabase');
  },

  // Load Services
  async loadServices() {
    const data = await this.getData();
    if (!data || !data.services || !data.services.length) return;

    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = data.services.map(service => `
      <div class="sheet-row service-card reveal">
        <span class="sheet-num service-number">${service.number}</span>
        <div class="sheet-content">
          <h3 class="service-title">${service.title}</h3>
          <p class="service-description">${service.description}</p>
        </div>
      </div>
    `).join('');

    console.log('✅ Services loaded from Supabase');
  },

  // Load Timeline
  async loadTimeline() {
    const data = await this.getData();
    if (!data || !data.timeline || !data.timeline.length) return;

    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    // Sort timeline by year
    const sortedTimeline = data.timeline.sort((a, b) => parseInt(a.year) - parseInt(b.year));

    timelineContainer.innerHTML = sortedTimeline.map(item => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-year">${item.year}</div>
          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-description">${item.description}</p>
        </div>
      </div>
    `).join('');

    console.log('✅ Timeline loaded from Supabase');
  },

  // Load Contact Information
  async loadContact() {
    const data = await this.getData();
    if (!data || !data.contact) return;

    const contact = data.contact;

    // Update address
    const addressEl = document.querySelector('.contact-address');
    if (addressEl && contact.address) {
      addressEl.textContent = contact.address;
    }

    const cityEl = document.querySelector('.contact-city');
    if (cityEl && contact.city) {
      cityEl.textContent = contact.city;
    }

    // Update phone numbers
    if (contact.phones && contact.phones.length > 0) {
      const phone1El = document.querySelector('.contact-phone-1');
      if (phone1El) {
        phone1El.textContent = contact.phones[0];
        phone1El.href = `tel:${contact.phones[0].replace(/\s/g, '')}`;
      }

      if (contact.phones[1]) {
        const phone2El = document.querySelector('.contact-phone-2');
        if (phone2El) {
          phone2El.textContent = contact.phones[1];
          phone2El.href = `tel:${contact.phones[1].replace(/\s/g, '')}`;
        }
      }
    }

    // Update email
    const emailEl = document.querySelector('.contact-email');
    if (emailEl && contact.email) {
      emailEl.textContent = contact.email;
      emailEl.href = `mailto:${contact.email}`;
    }

    const emailNoteEl = document.querySelector('.contact-email-note');
    if (emailNoteEl && contact.emailNote) {
      emailNoteEl.textContent = contact.emailNote;
    }

    // Update hours
    const hoursEl = document.querySelector('.contact-hours');
    if (hoursEl && contact.hours) {
      hoursEl.textContent = contact.hours;
    }

    const hoursDetailEl = document.querySelector('.contact-hours-detail');
    if (hoursDetailEl && contact.hoursDetail) {
      hoursDetailEl.textContent = contact.hoursDetail;
    }

    // Update social media links
    if (contact.social) {
      const socialLinks = {
        instagram: document.querySelector('a[href*="instagram"]'),
        linkedin: document.querySelector('a[href*="linkedin"]'),
        telegram: document.querySelector('a[href*="telegram"]')
      };

      if (socialLinks.instagram && contact.social.instagram) {
        socialLinks.instagram.href = contact.social.instagram;
      }
      if (socialLinks.linkedin && contact.social.linkedin) {
        socialLinks.linkedin.href = contact.social.linkedin;
      }
      if (socialLinks.telegram && contact.social.telegram) {
        socialLinks.telegram.href = contact.social.telegram;
      }
    }

    console.log('✅ Contact information loaded from Supabase');
  },

  // Initialize - Load all data on page load
  async init() {
    console.log('🔄 SupabaseFrontendLoader initializing...');
    
    // Wait for Supabase to be ready
    if (!window.SupabaseClient) {
      console.warn('Waiting for Supabase client...');
      setTimeout(() => this.init(), 500);
      return;
    }
    
    try {
      // Check which page we're on and load appropriate data
      const path = window.location.pathname;
      
      if (path.includes('index.html') || path.endsWith('/') || path.endsWith('biyaf')) {
        await this.loadHeroSection();
        await this.loadStatistics();
      }
      
      if (path.includes('projects.html')) {
        await this.loadProjects();
      }
      
      if (path.includes('services.html')) {
        await this.loadServices();
      }
      
      if (path.includes('about.html')) {
        await this.loadTimeline();
      }
      
      if (path.includes('contact.html')) {
        await this.loadContact();
      }

      console.log('✅ SupabaseFrontendLoader initialized successfully');
    } catch (error) {
      console.error('Error initializing SupabaseFrontendLoader:', error);
    }
  },

  // Setup realtime subscriptions for live updates
  setupRealtimeUpdates() {
    const client = window.SupabaseClient.get();
    if (!client) return;

    // Subscribe to changes in website_content table
    const subscription = client
      .channel('website_content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'website_content' }, 
        (payload) => {
          console.log('📡 Realtime update received:', payload);
          // Reload the page content
          this.init();
        }
      )
      .subscribe();

    console.log('✅ Realtime updates enabled');
  }
};

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      SupabaseFrontendLoader.init();
      SupabaseFrontendLoader.setupRealtimeUpdates();
    }, 1000);
  });
} else {
  setTimeout(() => {
    SupabaseFrontendLoader.init();
    SupabaseFrontendLoader.setupRealtimeUpdates();
  }, 1000);
}
