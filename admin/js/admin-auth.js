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
    // Trim whitespace from inputs
    username = username.trim();
    password = password.trim();
    
    console.log('Login attempt:', { username, password: password.substring(0, 3) + '***', remember });
    console.log('Expected credentials:', { username: this.credentials.username, password: this.credentials.password.substring(0, 3) + '***' });
    console.log('Username match:', username === this.credentials.username);
    console.log('Password match:', password === this.credentials.password);
    
    if (username === this.credentials.username && password === this.credentials.password) {
      console.log('Credentials match! Setting localStorage...');
      localStorage.setItem('biyaf_admin_logged_in', 'true');
      localStorage.setItem('biyaf_admin_username', username);
      
      if (remember) {
        localStorage.setItem('biyaf_admin_remember', 'true');
      }
      
      console.log('Login successful, localStorage set');
      return true;
    }
    
    console.log('Credentials do not match');
    console.log('Username entered:', JSON.stringify(username));
    console.log('Username expected:', JSON.stringify(this.credentials.username));
    console.log('Password entered:', JSON.stringify(password));
    console.log('Password expected:', JSON.stringify(this.credentials.password));
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
    const currentHref = window.location.href;
    
    // Check if we're on login page
    const isLoginPage = currentPage.includes('login.html') || currentHref.includes('login.html');
    // Check if we're on admin pages (but not login)
    const isAdminPage = (currentPage.includes('admin') || currentHref.includes('admin')) && !isLoginPage;
    
    if (isLoginPage) {
      console.log('Login page detected');
      if (this.isLoggedIn()) {
        console.log('Already logged in, redirecting to dashboard...');
        window.location.href = 'index.html';
      } else {
        console.log('Not logged in, initializing login page...');
        this.initLoginPage();
      }
    } else if (isAdminPage) {
      console.log('Admin page detected');
      if (!this.isLoggedIn()) {
        console.log('Not logged in, redirecting to login...');
        window.location.href = 'login.html';
      }
    }
  },

  // Initialize login page
  initLoginPage() {
    console.log('Initializing login page...');
    
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = togglePassword.querySelector('i');
        icon.className = type === 'password' ? 'ri-eye-line' : 'ri-eye-off-line';
      });
      console.log('Password toggle initialized');
    }

    // Handle login form submission
    if (loginForm) {
      console.log('Login form found, adding submit handler');
      
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        const rememberField = document.getElementById('remember');
        
        const username = usernameField ? usernameField.value : '';
        const password = passwordField ? passwordField.value : '';
        const remember = rememberField ? rememberField.checked : false;

        console.log('Form values:', { 
          username: username, 
          usernameLength: username.length,
          password: '***', 
          passwordLength: password.length,
          remember 
        });
        
        if (!username || !password) {
          this.showLoginError('Please enter both username and password');
          return;
        }
        
        console.log('Attempting login with username:', username);
        
        if (this.login(username, password, remember)) {
          console.log('Login successful! Redirecting...');
          // Add a small delay to ensure localStorage is written
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 100);
        } else {
          console.log('Login failed - invalid credentials');
          this.showLoginError('Invalid username or password. Please use: admin / admin123');
        }
      });
    } else {
      console.error('Login form not found!');
    }
  },

  // Show login error
  showLoginError(message) {
    // Remove existing error
    const existingError = document.querySelector('.luxury-alert');
    if (existingError) {
      existingError.remove();
    }

    // Create error element
    const error = document.createElement('div');
    error.className = 'luxury-alert error';
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
