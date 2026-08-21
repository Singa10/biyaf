// Admin Data Adapter - Syncs between LocalStorage and Supabase
const AdminDataAdapter = {
  useSupabase: false,
  supabaseClient: null,

  async init() {
    console.log('🔄 AdminDataAdapter initializing...');
    
    // Check if Supabase is available
    if (window.SupabaseClient && window.SupabaseClient.get) {
      this.supabaseClient = window.SupabaseClient.get();
      
      // Test connection
      try {
        const { error } = await this.supabaseClient
          .from('website_content')
          .select('id')
          .limit(1);
        
        if (!error) {
          this.useSupabase = true;
          console.log('✅ Supabase connected - using database storage');
        } else {
          console.warn('⚠️ Supabase table not accessible, using localStorage');
          this.useSupabase = false;
        }
      } catch (error) {
        console.warn('⚠️ Supabase connection failed, using localStorage:', error.message);
        this.useSupabase = false;
      }
    } else {
      console.log('📦 Supabase not configured - using localStorage');
      this.useSupabase = false;
    }

    // Load initial data
    await this.loadData();
  },

  async loadData() {
    if (this.useSupabase) {
      return await this.loadFromSupabase();
    } else {
      return this.loadFromLocalStorage();
    }
  },

  async loadFromSupabase() {
    try {
      const { data, error } = await this.supabaseClient
        .from('website_content')
        .select('*');
      
      if (error) throw error;
      
      // Convert array to object
      const dataObject = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          dataObject[item.section] = item.content;
        });
      }
      
      // Sync to localStorage as backup
      localStorage.setItem('biyaf_website_data', JSON.stringify(dataObject));
      
      return dataObject;
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return this.loadFromLocalStorage();
    }
  },

  loadFromLocalStorage() {
    const data = localStorage.getItem('biyaf_website_data');
    return data ? JSON.parse(data) : this.getDefaultData();
  },

  async saveData(dataObject) {
    console.log('💾 Saving data to localStorage...', dataObject);
    
    // Always save to localStorage first
    localStorage.setItem('biyaf_website_data', JSON.stringify(dataObject));
    console.log('✅ Data saved to localStorage');
    
    // Then save to Supabase if available
    if (this.useSupabase) {
      await this.saveToSupabase(dataObject);
    }
    
    // Notify frontend
    this.notifyFrontend();
    console.log('📢 Frontend notified of data update');
  },

  async saveToSupabase(dataObject) {
    try {
      // Convert object to array of sections
      const sections = Object.keys(dataObject).map(section => ({
        section: section,
        content: dataObject[section],
        updated_at: new Date().toISOString()
      }));

      // Delete existing data
      await this.supabaseClient
        .from('website_content')
        .delete()
        .neq('id', 0);
      
      // Insert new data
      const { error } = await this.supabaseClient
        .from('website_content')
        .insert(sections);
      
      if (error) throw error;
      
      console.log('✅ Data saved to Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error saving to Supabase:', error);
      throw error;
    }
  },

  async updateSection(section, content) {
    const data = await this.loadData();
    data[section] = content;
    await this.saveData(data);
    console.log(`✅ Section "${section}" updated:`, content);
  },

  async getSection(section) {
    const data = await this.loadData();
    return data[section] || null;
  },

  notifyFrontend() {
    window.dispatchEvent(new CustomEvent('biyaf_data_updated'));
  },

  getDefaultData() {
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
        }
      ],
      timeline: [
        { year: '2012', title: 'Studio Founded', description: 'Biyaf opens as a three-person practice in Bole, taking on its first residential commissions.' },
        { year: '2016', title: 'First Commercial Tower', description: 'Delivery of a mixed-use building in Bale Robe introduces the studio\'s ventilated-facade approach.' }
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

  async resetToDefaults() {
    const defaultData = this.getDefaultData();
    await this.saveData(defaultData);
    return defaultData;
  },

  // Export data
  async exportData() {
    const data = await this.loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biyaf-data-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import data
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

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AdminDataAdapter.init();
  });
} else {
  AdminDataAdapter.init();
}
