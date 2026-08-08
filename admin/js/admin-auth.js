// Admin Authentication System
const AdminAuth = {
  // Default credentials (in production, use proper backend authentication)
  credentials: {
    username: 'admin',
    password: 'admin123' // In production, use hashed passwords
  },

  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('biyaf_admin_logged_in') === 'true';
  },

  // Login
  login(username, password, remember = false) {
    if (username === this.credentials.username && password === this.credentials.password) {
      localStorage.setItem('biyaf_admin_logged_in', 'true');
      localStorage.setItem('biyaf_admin_username', username);
      
      if (remember) {
        localStorage.setItem('biyaf_admin_remember', 'true');
      }
      
      return true;
    }
    return false;
  },

  // Logout
  logout() {
    if (!localStorage.getItem('biyaf_admin_remember')) {
      localStorage.removeItem('biyaf_admin_logged_in');
    }
    localStorage.removeItem('biyaf_admin_username');
    window.location.href = 'login.html';
  },

  // Get username
  getUsername() {
    return localStorage.getItem('biyaf_admin_username') || 'Admin';
  },

  // Initialize auth check
  init() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login.html')) {
      if (this.isLoggedIn()) {
        window.location.href = 'index.html';
      }
      this.initLoginPage();
    } else if (currentPage.includes('admin')) {
      if (!this.isLoggedIn()) {
        window.location.href = 'login.html';
      }
    }
  },

  // Initialize login page
  initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
      togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = togglePassword.querySelector('i');
        icon.className = type === 'password' ? 'ri-eye-line' : 'ri-eye-off-line';
      });
    }

    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        if (this.login(username, password, remember)) {
          window.location.href = 'index.html';
        } else {
          this.showLoginError('Invalid username or password');
        }
      });
    }
  },

  // Show login error
  showLoginError(message) {
    // Remove existing error
    const existingError = document.querySelector('.login-error');
    if (existingError) {
      existingError.remove();
    }

    // Create error element
    const error = document.createElement('div');
    error.className = 'alert alert-error login-error';
    error.innerHTML = `<i class="ri-error-warning-line"></i><span>${message}</span>`;
    
    const loginForm = document.getElementById('login-form');
    loginForm.insertBefore(error, loginForm.firstChild);

    // Remove after 5 seconds
    setTimeout(() => error.remove(), 5000);
  }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  AdminAuth.init();
});
