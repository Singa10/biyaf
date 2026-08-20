// Supabase Data Manager - Database-based content management
const SupabaseData = {
  // Table name
  tableName: 'website_content',
  
  // Initialize - Create table if needed and load default data
  async init() {
    try {
      const client = window.SupabaseClient?.get();
      if (!client) {
        console.warn('⚠️ Supabase client not available - using fallback mode');
        return false;
      }

      // Check if data exists
      const hasData = await this.hasData();
      
      if (!hasData) {
        console.log('📦 No data found, initializing defaults...');
        await this.resetToDefaults();
      }
      
      console.log('✅ SupabaseData initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing SupabaseData:', error);
      console.log('📦 Continuing in fallback mode');
      return false;
    }
  },

  // Check if data exists
  async hasData() {
    try {
      const client = window.SupabaseClient.get();
      const { data, error } = await client
        .from(this.tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Error checking data:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasData:', error);
      return false;
    }
  },

  // Get all data
  async getData() {
    try {
      const client = window.SupabaseClient?.get();
      if (!client) {
        console.warn('⚠️ Supabase not configured, using default data');
        return this.getDefaultData();
      }

      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .order('section', { ascending: true });
      
      if (error) {
        console.error('Error fetching data:', error);
        return this.getDefaultData();
      }
      
      // Convert array of sections to object
      const dataObject = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          dataObject[item.section] = item.content;
        });
        return dataObject;
      }
      
      return this.getDefaultData();
    } catch (error) {
      console.error('Error in getData:', error);
      return this.getDefaultData();
    }
  },

  // Save all data
  async saveData(dataObject) {
    try {
      const client = window.SupabaseClient.get();
      
      // Convert object to array of sections
      const sections = Object.keys(dataObject).map(section => ({
        section: section,
        content: dataObject[section],
        updated_at: new Date().toISOString()
      }));

      // Delete all existing data
      await client.from(this.tableName).delete().neq('id', 0);
      
      // Insert new data
      const { error } = await client
        .from(this.tableName)
        .insert(sections);
      
      if (error) {
        console.error('Error saving data:', error);
        throw error;
      }
      
      this.notifyFrontend();
      console.log('✅ Data saved to Supabase');
      return true;
    } catch (error) {
      console.error('Error in saveData:', error);
      throw error;
    }
  },

  // Get specific section
  async getSection(section) {
    try {
      const client = window.SupabaseClient.get();
      const { data, error } = await client
        .from(this.tableName)
        .select('content')
        .eq('section', section)
        .single();
      
      if (error) {
        console.error(`Error fetching section ${section}:`, error);
        return null;
      }
      
      return data ? data.content : null;
    } catch (error) {
      console.error(`Error in getSection ${section}:`, error);
      return null;
    }
  },

  // Update specific section
  async updateSection(section, content) {
    try {
      const client = window.SupabaseClient.get();
      
      // Check if section exists
      const { data: existing } = await client
        .from(this.tableName)
        .select('id')
        .eq('section', section)
        .single();
      
      if (existing) {
        // Update existing
        const { error } = await client
          .from(this.tableName)
          .update({ 
            content: content,
            updated_at: new Date().toISOString()
          })
          .eq('section', section);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await client
          .from(this.tableName)
          .insert([{
            section: section,
            content: content,
            updated_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }
      
      this.notifyFrontend();
      console.log(`✅ Section ${section} updated`);
      return true;
    } catch (error) {
      console.error(`Error updating section ${section}:`, error);
      throw error;
    }
  },

  // Notify frontend to reload
  notifyFrontend() {
    window.dispatchEvent(new Event('biyaf_data_updated'));
  },

  // Get default data structure
  getDefaultData() {
    return {
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
  },

  // Reset to default values
  async resetToDefaults() {
    const defaultData = this.getDefaultData();
    await this.saveData(defaultData);
    console.log('✅ Data reset to defaults');
    return defaultData;
  },

  // Export data as JSON
  async exportData() {
    const data = await this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biyaf-data-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import data from JSON
  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          await this.saveData(data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

// Initialize on load (after Supabase client is ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for Supabase to initialize
    setTimeout(() => SupabaseData.init(), 500);
  });
} else {
  setTimeout(() => SupabaseData.init(), 500);
}
