// Frontend Data Loader - Loads admin data into website pages
const DataLoader = {
  // Get data from localStorage
  getData() {
    try {
      const data = localStorage.getItem('biyaf_website_data');
      
      // If no data exists, initialize with defaults
      if (!data) {
        console.log('No data in localStorage, initializing defaults...');
        this.initializeDefaultData();
        return this.getData(); // Call again to get the newly saved data
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },

  // Initialize default data if localStorage is empty
  initializeDefaultData() {
    const defaultData = {
      hero: {
        eyebrow: 'Biyaf Architecture Studio',
        title: 'We design buildings that <em>hold their ground</em>.',
        description: 'Biyaf is a design-led architecture practice shaping residential, commercial and public buildings across Ethiopia — built on precision, material honesty, and a deep read of site and climate.',
        buttons: [
          { text: 'View Projects', link: 'projects.html', style: 'solid' },
          { text: 'Start a Project', link: 'contact.html', style: 'outline' }
        ],
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
          description: 'Full concept-to-construction design services — from feasibility studies and concept massing through to detailed construction drawings, for homes, offices, retail and institutional buildings.'
        },
        {
          id: 2,
          number: 'A—02',
          title: 'Interior Architecture',
          description: 'Spatial planning, material palettes, lighting design and custom joinery that carry a building\'s architectural language through to its interior spaces.'
        },
        {
          id: 3,
          number: 'A—03',
          title: 'Urban & Masterplanning',
          description: 'Site strategy, density and massing studies, and full masterplans for mixed-use and multi-phase developments.'
        },
        {
          id: 4,
          number: 'A—04',
          title: 'Renovation & Restoration',
          description: 'Adaptive reuse, structural renewal and sensitive restoration for existing buildings and heritage sites.'
        },
        {
          id: 5,
          number: 'A—05',
          title: 'Construction Administration',
          description: 'On-site oversight through the build phase, coordinating contractors and engineers to keep a project true to its drawings.'
        }
      ],

      about: {
        story: {
          eyebrow: 'Our Story',
          title: 'Designing with the land, not over it',
          paragraphs: [
            'Biyaf was founded by a small group of architects who trained across Ethiopia and abroad, and came home with one question: why did so much new construction ignore the climate, materials and craft already available on site?',
            'Today the studio works across residential, commercial and public-sector commissions, but the founding question still shapes every project brief — read the site first, then design.'
          ],
          image: 'images/about-mansion.jpeg'
        },
        values: [
          { title: 'Site First', description: 'Topography, light and wind studies happen before a single wall is sketched.' },
          { title: 'Material Honesty', description: 'We build in materials that age well and are sourced close to where they\'re used.' },
          { title: 'Built to Last', description: 'Structures designed to outlive trends, with maintenance and climate resilience in mind.' }
        ]
      },

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

    localStorage.setItem('biyaf_website_data', JSON.stringify(defaultData));
    console.log('✅ Default data initialized in localStorage');
    return defaultData;
  },

  // Load Hero Section
  loadHeroSection() {
    const data = this.getData();
    console.log('📥 Loading hero section from data:', data);
    
    if (!data || !data.hero) {
      console.warn('⚠️ No hero data found!');
      return;
    }

    const hero = data.hero;
    console.log('🎯 Hero data to load:', hero);
    
    // Update eyebrow text
    const eyebrow = document.querySelector('.hero-eyebrow');
    if (eyebrow && hero.eyebrow) {
      eyebrow.textContent = hero.eyebrow;
      console.log('✅ Updated eyebrow');
    }

    // Update title
    const title = document.querySelector('.hero-title');
    if (title && hero.title) {
      title.innerHTML = hero.title;
      console.log('✅ Updated title');
    }

    // Update description
    const description = document.querySelector('.hero-description');
    if (description && hero.description) {
      description.textContent = hero.description;
      console.log('✅ Updated description');
    }

    // Update hero image
    console.log('🔍 Looking for hero image element...');
    const heroImage = document.getElementById('hero-image') ||
                      document.querySelector('.hero-image-wrapper img') || 
                      document.querySelector('.hero-photo img') ||
                      document.querySelector('.hero img');
    
    console.log('🖼️ Hero image element found:', heroImage);
    console.log('🖼️ Current src:', heroImage ? heroImage.src : 'NOT FOUND');
    console.log('🖼️ New src from data:', hero.image);
    
    if (heroImage && hero.image) {
      const oldSrc = heroImage.src;
      
      // Check if this is an uploaded image (stored in localStorage)
      const uploadedImage = this.getUploadedImage(hero.image);
      
      if (uploadedImage && uploadedImage.dataUrl) {
        // Use base64 data for uploaded images
        console.log('📦 Loading UPLOADED image from localStorage');
        heroImage.src = uploadedImage.dataUrl;
      } else {
        // Use regular path for existing images
        console.log('📁 Loading EXISTING image from server');
        heroImage.src = hero.image;
      }
      
      // Also update alt text if provided
      if (hero.imageAlt) {
        heroImage.alt = hero.imageAlt;
      }
      
      console.log('✅ Hero image updated!');
      console.log('   From:', oldSrc);
      console.log('   To:', heroImage.src.substring(0, 100) + (heroImage.src.length > 100 ? '...' : ''));
      
      // Force reload if browser cached the image
      heroImage.style.display = 'none';
      heroImage.offsetHeight; // Force reflow
      heroImage.style.display = 'block';
      
    } else {
      if (!heroImage) {
        console.error('❌ CRITICAL: Hero image element NOT FOUND!');
        console.error('   Tried selectors: #hero-image, .hero-image-wrapper img, .hero-photo img, .hero img');
        console.error('   Page structure may have changed');
      }
      if (!hero.image) {
        console.error('❌ CRITICAL: No image path in hero data!');
        console.error('   Hero data:', hero);
      }
    }

    // Update coordinates
    const coordinates = document.querySelector('.hero-coordinates');
    if (coordinates && hero.coordinates) {
      coordinates.textContent = hero.coordinates;
      console.log('✅ Updated coordinates');
    }

    // Update figure label
    const figureLabel = document.querySelector('.hero-figure');
    if (figureLabel && hero.figureLabel) {
      figureLabel.textContent = hero.figureLabel;
      console.log('✅ Updated figure label');
    }

    console.log('✅ Hero section loaded from admin data');
  },

  // Get uploaded image data from localStorage
  getUploadedImage(imagePath) {
    try {
      const uploadedImages = localStorage.getItem('biyaf_uploaded_images');
      if (!uploadedImages) return null;
      
      const images = JSON.parse(uploadedImages);
      
      // Find image by path or filename
      const filename = imagePath.split('/').pop(); // Get filename from path
      
      return images.find(img => 
        img.path === imagePath || 
        img.filename === filename ||
        img.originalName === filename
      );
    } catch (error) {
      console.error('Error loading uploaded images:', error);
      return null;
    }
  },

  // Load Statistics
  loadStatistics() {
    const data = this.getData();
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

    console.log('Statistics loaded from admin data');
  },

  // Load Projects
  loadProjects() {
    const data = this.getData();
    if (!data || !data.projects || !data.projects.length) return;

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = data.projects.map(project => `
      <div class="project-card">
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

    console.log('Projects loaded from admin data');
  },

  // Load Services
  loadServices() {
    const data = this.getData();
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

    console.log('Services loaded from admin data');
  },

  // Load Timeline
  loadTimeline() {
    const data = this.getData();
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

    console.log('Timeline loaded from admin data');
  },

  // Load Contact Information
  loadContact() {
    const data = this.getData();
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

    console.log('Contact information loaded from admin data');
  },

  // Initialize - Load all data on page load
  init() {
    console.log('DataLoader initializing...');
    console.log('Current pathname:', window.location.pathname);
    console.log('Current href:', window.location.href);
    
    // Listen for data updates from admin
    window.addEventListener('biyaf_data_updated', () => {
      console.log('🔄 Data updated from admin, reloading page content...');
      this.reloadCurrentPage();
    });
    
    // Check which page we're on and load appropriate data
    const path = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();
    
    // Homepage detection - multiple conditions
    if (path.includes('index.html') || path.endsWith('/') || path.endsWith('/biyaf') || href.includes('localhost:3000/index') || href.includes('localhost:8000')) {
      console.log('✅ Detected homepage - loading hero and stats');
      this.loadHeroSection();
      this.loadStatistics();
    }
    
    if (path.includes('projects.html')) {
      console.log('✅ Detected projects page');
      this.loadProjects();
    }
    
    if (path.includes('services.html')) {
      console.log('✅ Detected services page');
      this.loadServices();
    }
    
    if (path.includes('about.html')) {
      console.log('✅ Detected about page');
      this.loadTimeline();
    }
    
    if (path.includes('contact.html')) {
      console.log('✅ Detected contact page');
      this.loadContact();
    }

    console.log('✅ DataLoader initialized successfully');
    
    // Dispatch event to signal data loader is done
    window.dispatchEvent(new CustomEvent('dataLoaderReady'));
  },

  // Reload current page content (called when data is updated)
  reloadCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();
    
    if (path.includes('index.html') || path.endsWith('/') || path.endsWith('/biyaf') || href.includes('localhost:3000/index') || href.includes('localhost:8000')) {
      console.log('🔄 Reloading homepage content...');
      this.loadHeroSection();
      this.loadStatistics();
    }
    
    if (path.includes('projects.html')) {
      console.log('🔄 Reloading projects...');
      this.loadProjects();
    }
    
    if (path.includes('services.html')) {
      console.log('🔄 Reloading services...');
      this.loadServices();
    }
    
    if (path.includes('about.html')) {
      console.log('🔄 Reloading timeline...');
      this.loadTimeline();
    }
    
    if (path.includes('contact.html')) {
      console.log('🔄 Reloading contact...');
      this.loadContact();
    }
  }
};

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DataLoader: DOM loaded, initializing...');
    DataLoader.init();
  });
} else {
  console.log('DataLoader: DOM already loaded, initializing immediately...');
  DataLoader.init();
}
