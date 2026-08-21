// Hero Section Fix - Enhanced version with better debugging
// This file can be included to override the hero section functionality

if (typeof AdminAppNew !== 'undefined') {
  // Override the loadHeroSection method
  AdminAppNew.loadHeroSection = async function() {
    const hero = await this.dataAdapter.getSection('hero') || {};
    const content = document.getElementById('admin-content');
    
    console.log('📥 Loading hero section form with data:', hero);
    
    content.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 2rem; margin: 0 0 0.5rem 0;">Hero Section</h2>
          <p style="color: var(--muted); margin: 0;">Edit the main homepage hero content</p>
        </div>

        <!-- Save Status Indicator -->
        <div id="save-status" style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 2rem; display: none;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 600;">
            <i class="ri-checkbox-circle-line"></i>
            <span id="save-message">Changes saved successfully!</span>
          </div>
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
              <button type="button" onclick="AdminAppNew.loadHeroSection()" style="background: rgba(255,255,255,0.1); color: var(--ivory); padding: 1rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                <i class="ri-refresh-line"></i> Reset
              </button>
            </div>
          </div>
        </form>

        <!-- Instructions -->
        <div style="background: rgba(194, 158, 89, 0.1); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(194, 158, 89, 0.2); margin-top: 2rem;">
          <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ri-information-line"></i> How to Update Hero Section
          </h4>
          <ol style="color: var(--muted); line-height: 1.8; margin: 0; padding-left: 1.5rem;">
            <li>Edit the fields above with your content</li>
            <li>Click "Save Changes" button</li>
            <li>Wait for success message (green alert)</li>
            <li><strong>Refresh the homepage</strong> to see your changes</li>
          </ol>
          <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 6px;">
            <strong>🔗 Quick Links:</strong><br>
            <a href="../" target="_blank" style="color: var(--gold); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
              <i class="ri-external-link-line"></i> Open Homepage
            </a>
            <span style="color: var(--muted); margin: 0 0.75rem;">•</span>
            <a href="../test-hero-data.html" target="_blank" style="color: var(--gold); text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="ri-bug-line"></i> Debug Tool
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Attach form handler
    document.getElementById('hero-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const heroData = Object.fromEntries(formData);
      
      console.log('📝 Submitting hero data:', heroData);
      
      // Disable submit button
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> Saving...';
      submitBtn.disabled = true;
      
      try {
        await this.dataAdapter.updateSection('hero', heroData);
        
        // Show success status
        const saveStatus = document.getElementById('save-status');
        const saveMessage = document.getElementById('save-message');
        saveStatus.style.display = 'block';
        saveMessage.textContent = 'Changes saved! Refresh the homepage to see your updates.';
        
        // Show alert
        this.showAlert('✅ Hero section updated successfully! Refresh the homepage to see changes.', 'success');
        
        // Re-enable button
        submitBtn.innerHTML = '<i class="ri-check-line"></i> Saved!';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
        
        console.log('✅ Hero section saved successfully');
        
      } catch (error) {
        console.error('❌ Save error:', error);
        this.showAlert('❌ Failed to save: ' + error.message, 'error');
        
        // Re-enable button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
    
    console.log('✅ Hero section form loaded');
  };
  
  console.log('✅ Hero section fix loaded - enhanced version active');
}
