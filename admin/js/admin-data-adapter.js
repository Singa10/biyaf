// Admin Data Adapter - Provides backward compatibility with old AdminData API using Supabase
const AdminData = {
  // Initialize
  async init() {
    return await SupabaseData.init();
  },

  // Get all data
  getData() {
    return SupabaseData.getData();
  },

  // Save all data
  saveData(data) {
    return SupabaseData.saveData(data);
  },

  // Get specific section
  getSection(section) {
    return SupabaseData.getSection(section);
  },

  // Update specific section
  updateSection(section, content) {
    return SupabaseData.updateSection(section, content);
  },

  // Notify frontend
  notifyFrontend() {
    return SupabaseData.notifyFrontend();
  },

  // Reset to defaults
  resetToDefaults() {
    return SupabaseData.resetToDefaults();
  },

  // Export data
  exportData() {
    return SupabaseData.exportData();
  },

  // Import data
  importData(file) {
    return SupabaseData.importData(file);
  }
};

// Make it available globally
window.AdminData = AdminData;
