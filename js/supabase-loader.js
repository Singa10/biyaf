// Frontend Supabase Data Loader - Loads admin data from Supabase into website pages
const SupabaseFrontendLoader = {
  // Mock data fallback
  getMockData() {
    return {
      hero: {
        eyebrow: 'Biyaf Architecture Studio',
        title: 'We design buildings that <em>hold their ground</em>.',
        description: 'Biyaf is a design-led architecture practice shaping residential, commercial and public buildings across Ethiopia — built on precision, material honesty, and a deep read of site and climate.',
        image: 'images/hero-residence.jpeg',
        imageAlt: 'Luxury modern residence with large windows at dusk, designed by Biyaf',
        coordinates: 'N 09°02\' E 38°45\'',
        figureLabel: 'FIG. 01 — RESIDENCE'
      },
      stats: [
        { number: 14, label: 'Years in Practice', suffix: '' },
        { number: 86, label: 'Projects Delivered', suffix: '+' },
        { number: 12, label: 'Cities Built In', suffix: '' },
        { number: 23, label: 'Team Members', suffix: '' }
      ],
      projects: [
        {
          id: 1,
          title: 'Kebena Residence',
          description: 'A terraced concrete home stepping down a ridge in Bale Robe.',
          category: 'residential',
          year: '2023',
          projectCode: 'PRJ.014',
          image: 'images/project-kebena.jpeg'
        },
        {
          id: 2,
          title: 'Bole Commerce Hub',
          description: 'Mixed-use tower with a ventilated stone facade and public plaza.',
          category: 'commercial',
          year: '2022',
          projectCode: 'PRJ.021',
          image: 'images/project-bole.jpeg'
        },
        {
          id: 3,
          title: 'Entoto Cultural Pavilion',
          description: 'A timber-framed civic hall referencing traditional roof forms.',
          category: 'public',
          year: '2020',
          projectCode: 'PRJ.009',
          image: 'images/project-entoto.jpeg'
        },
        {
          id: 4,
          title: 'Sarbet Courtyard House',
          description: 'Two volumes wrapped around a shaded internal courtyard.',
          category: 'residential',
          year: '2021',
          projectCode: 'PRJ.011',
          image: 'images/project-sarbet.jpeg'
        },
        {
          id: 5,
          title: 'Mercato Office Block',
          description: 'A stacked-slab office building with deep shading fins.',
          category: 'commercial',
          year: '2024',
          projectCode: 'PRJ.028',
          image: 'images/project-mercato.jpeg'
        },
        {
          id: 6,
          title: 'Piassa Public Library',
          description: 'A single-storey reading hall with a folded timber roof.',
          category: 'public',
          year: '2025',
          projectCode: 'PRJ.033',
          image: 'images/project-piassa.jpeg'
        }
      ],
      services: [
        {
          id: 1,
          number: 'A—01',
          title: 'Architectural Design',
          description: 'Full concept-to-construction design for residential, commercial and institutional buildings.'
        },
        {
          id: 2,
          number: 'A—02',
          title: 'Interior Architecture',
          description: 'Spatial planning, material selection and custom joinery that carries the building\'s language inward.'
        },
        {
          id: 3,
          number: 'A—03',
          title: 'Urban & Masterplanning',
          description: 'Site strategy, density studies and masterplans for mixed-use developments.'
        },
        {
          id: 4,
          number: 'A—04',
          title: 'Renovation & Restoration',
          description: 'Adaptive reuse and structural renewal for existing buildings and heritage sites.'
        }
      ],
      timeline: [
        { year: '2012', title: 'Studio Founded', description: 'Biyaf opens as a three-person practice in Bole, taking on its first residential commissions.' },
        { year: '2016', title: 'First Commercial Tower', description: 'Delivery of a mixed-use building in Bale Robe introduces the studio\'s ventilated-facade approach.' },
        { year: '2020', title: 'Public Sector Work Begins', description: 'Biyaf is commissioned for its first civic project, a community pavilion referencing traditional roof forms.' },
        { year: '2026', title: '86+ Projects Delivered', description: 'The studio now works across 12 cities with a team of 23 architects, designers and engineers.' }
      ],
      contact: {
        address: 'Wako Gutu Adebabay, Bale Robe',
        city: 'Bale Robe, Ethiopia',
        phones: ['+251 90 008 5951', '+251 94 929 2418'],
        email: 'studio@biyaf.et',
        emailNote: 'Response within 2 business days',
        hours: 'Mon – Fri',
        hoursDetail: '8:30 AM – 6:00 PM',
        social: {
          instagram: '#',
          linkedin: '#',
          telegram: '#'
        }
      }
    };
  },

  // Get data from Supabase with fallback to mock data
  async getData() {
    try {
      const client = window.SupabaseClient?.get();
      if (!client) {
        console.warn('⚠️ Supabase client not available, using mock data');
        return this.getMockData();
      }

      const { data, error } = await client
        .from('website_content')
        .select('*')
        .order('section', { ascending: true });
      
      if (error) {
        console.warn('⚠️ Error loading from Supabase, using mock data:', error.message);
        return this.getMockData();
      }
      
      // Convert array to object
      const dataObject = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          dataObject[item.section] = item.content;
        });
        console.log('✅ Data loaded from Supabase');
        return dataObject;
      } else {
        console.warn('⚠️ No data in Supabase, using mock data');
        return this.getMockData();
      }
    } catch (error) {
      console.warn('⚠️ Error fetching from Supabase, using mock data:', error.message);
      return this.getMockData();
    }
  },

  // Load Hero Section
  async loadHeroSection() {
    const data = await this.getData();
    if (!data || !data.hero) {
      console.warn('⚠️ No hero data available');
      return;
    }

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

    console.log('✅ Hero section loaded (source: ' + (data._source || 'Supabase/Mock') + ')');
  },

  // Load Statistics
  async loadStatistics() {
    const data = await this.getData();
    if (!data || !data.stats || !data.stats.length) {
      console.warn('⚠️ No statistics data available');
      return;
    }

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

    console.log('✅ Statistics loaded');
  },

  // Load Projects
  async loadProjects() {
    const data = await this.getData();
    if (!data || !data.projects || !data.projects.length) {
      console.warn('⚠️ No projects data available');
      return;
    }

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

    console.log('✅ Projects loaded');
  },

  // Load Services
  async loadServices() {
    const data = await this.getData();
    if (!data || !data.services || !data.services.length) {
      console.warn('⚠️ No services data available');
      return;
    }

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

    console.log('✅ Services loaded');
  },

  // Load Timeline
  async loadTimeline() {
    const data = await this.getData();
    if (!data || !data.timeline || !data.timeline.length) {
      console.warn('⚠️ No timeline data available');
      return;
    }

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

    console.log('✅ Timeline loaded');
  },

  // Load Contact Information
  async loadContact() {
    const data = await this.getData();
    if (!data || !data.contact) {
      console.warn('⚠️ No contact data available');
      return;
    }

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

    console.log('✅ Contact information loaded');
  },

  // Initialize - Load all data on page load
  async init() {
    console.log('🔄 SupabaseFrontendLoader initializing...');
    
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
      console.error('❌ Error initializing SupabaseFrontendLoader:', error);
      console.log('📦 Using mock data fallback');
    }
  },

  // Setup realtime subscriptions for live updates
  setupRealtimeUpdates() {
    const client = window.SupabaseClient?.get();
    if (!client) {
      console.log('⏭️ Realtime updates not available (Supabase not configured)');
      return;
    }

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
