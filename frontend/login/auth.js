// auth.js - Authentication handling with backend interaction

class AuthHandler {
    constructor() {
        this.selectedUserType = 'teacher';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStoredData();
    }

    bindEvents() {
        // User type selection
        const userTypes = document.querySelectorAll('.user-type');
        userTypes.forEach(type => {
            type.addEventListener('click', (e) => this.selectUserType(e));
        });

        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Toggle forms (if you add signup later)
        const toggleLinks = document.querySelectorAll('[data-toggle]');
        toggleLinks.forEach(link => {
            link.addEventListener('click', (e) => this.toggleForm(e));
        });

        // Forgot password
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => this.handleForgotPassword(e));
        }

        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });

        // Remember me functionality
        const rememberMe = document.getElementById('rememberMe');
        if (rememberMe) {
            rememberMe.addEventListener('change', (e) => this.handleRememberMe(e));
        }
    }

    selectUserType(e) {
        // Remove selected class from all user types
        document.querySelectorAll('.user-type').forEach(type => {
            type.classList.remove('selected');
        });

        // Add selected class to clicked type
        e.currentTarget.classList.add('selected');
        this.selectedUserType = e.currentTarget.dataset.type;
        
        console.log('Selected user type:', this.selectedUserType);
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Basic validation
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        // Prepare login data
        const loginData = {
            email: email.toLowerCase().trim(),
            password: password,
            userType: this.selectedUserType,
            rememberMe: rememberMe
        };

        try {
            // Show loading state
            this.setLoadingState(true);
            
            // Make API call to backend
            const response = await this.apiCall('/api/auth/login', 'POST', loginData);
            
            if (response.success) {
                // Store authentication token
                if (rememberMe) {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userType', this.selectedUserType);
                } else {
                    sessionStorage.setItem('authToken', response.token);
                    sessionStorage.setItem('userType', this.selectedUserType);
                }

                // Store user info
                this.storeUserInfo(response.user);

                // Show success message
                this.showSuccess('Login successful! Redirecting...');

                // Redirect based on user type
                setTimeout(() => {
                    if (this.selectedUserType === 'teacher') {
                        window.location.href = '../dashboard/teacher.html';
                    } else {
                        window.location.href = '../dashboard/student.html';
                    }
                }, 1500);

            } else {
                this.showError(response.message || 'Login failed. Please try again.');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showError('Network error. Please check your connection and try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address:');
        
        if (!email || !this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        try {
            this.setLoadingState(true);
            
            const response = await this.apiCall('/api/auth/forgot-password', 'POST', {
                email: email.toLowerCase().trim(),
                userType: this.selectedUserType
            });

            if (response.success) {
                this.showSuccess('Password reset instructions sent to your email');
            } else {
                this.showError(response.message || 'Failed to send reset email');
            }

        } catch (error) {
            console.error('Forgot password error:', error);
            this.showError('Network error. Please try again later.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleSocialLogin(e) {
        e.preventDefault();
        
        const btnText = e.currentTarget.textContent.trim();
        const provider = btnText.includes('Google') ? 'google' : 'microsoft';
        
        try {
            // In a real implementation, you would redirect to OAuth provider
            // For now, we'll simulate the flow
            this.setLoadingState(true);
            
            // Redirect to OAuth provider
            const redirectUrl = `${window.location.origin}/auth/callback`;
            const oauthUrl = await this.getOAuthUrl(provider, redirectUrl);
            
            // Store selected user type for after OAuth
            sessionStorage.setItem('pendingUserType', this.selectedUserType);
            
            // Redirect to OAuth provider
            window.location.href = oauthUrl;
            
        } catch (error) {
            console.error('Social login error:', error);
            this.showError(`${provider} login is temporarily unavailable`);
            this.setLoadingState(false);
        }
    }

    async getOAuthUrl(provider, redirectUrl) {
        const response = await this.apiCall('/api/auth/oauth/url', 'POST', {
            provider: provider,
            redirectUrl: redirectUrl,
            userType: this.selectedUserType
        });
        
        return response.authUrl;
    }

    handleRememberMe(e) {
        const isChecked = e.target.checked;
        
        // If unchecked, clear any stored credentials
        if (!isChecked) {
            localStorage.removeItem('rememberedEmail');
        }
        
        console.log('Remember me:', isChecked);
    }

    toggleForm(e) {
        e.preventDefault();
        const targetForm = e.target.dataset.toggle;
        
        // This would handle switching between login/signup forms
        // Currently only login is implemented
        console.log('Toggle to:', targetForm);
        
        if (targetForm === 'signup') {
            // Redirect to signup page or show signup form
            alert('Signup functionality to be implemented');
        }
    }

    // Utility methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        // Backend URL - adjust port if different
        const BASE_URL = 'http://localhost:5000';
        const fullUrl = `${BASE_URL}${endpoint}`;

        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        // Add auth token if available
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(fullUrl, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    setLoadingState(isLoading) {
        const submitBtn = document.querySelector('.submit-btn');
        const socialBtns = document.querySelectorAll('.social-btn');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            socialBtns.forEach(btn => btn.disabled = true);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
            socialBtns.forEach(btn => btn.disabled = false);
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;

        // Insert after the form
        const form = document.getElementById('loginForm');
        form.parentNode.insertBefore(messageDiv, form.nextSibling);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    storeUserInfo(user) {
        const storage = document.getElementById('rememberMe').checked ? localStorage : sessionStorage;
        storage.setItem('userInfo', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
            avatar: user.avatar || null
        }));
    }

    loadStoredData() {
        // Load remembered email if available
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            document.getElementById('loginEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }

        // Check if user is already logged in
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            this.redirectIfLoggedIn();
        }
    }

    async redirectIfLoggedIn() {
        try {
            // Verify token is still valid
            const response = await this.apiCall('/api/auth/verify');
            if (response.valid) {
                const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType');
                if (userType === 'teacher') {
                    window.location.href = '../dashboard/teacher.html';
                } else {
                    window.location.href = '../dashboard/student.html';
                }
            }
        } catch (error) {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            console.log('Token verification failed, staying on login page');
        }
    }
}

// Handle OAuth callback if present
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
        console.error('OAuth error:', error);
        return;
    }

    if (code && state) {
        // Handle OAuth success
        exchangeCodeForToken(code, state);
    }
}

async function exchangeCodeForToken(code, state) {
    try {
        const userType = sessionStorage.getItem('pendingUserType') || 'student';
        
        const response = await fetch('/api/auth/oauth/callback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                state: state,
                userType: userType
            })
        });

        const data = await response.json();

        if (data.success) {
            // Store token and redirect
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userType', userType);
            
            if (userType === 'teacher') {
                window.location.href = '../dashboard/teacher.html';
            } else {
                window.location.href = '../dashboard/student.html';
            }
        } else {
            console.error('OAuth callback failed:', data.message);
            window.location.href = '/auth/auth.html?error=oauth_failed';
        }

    } catch (error) {
        console.error('OAuth callback error:', error);
        window.location.href = '/auth/auth.html?error=oauth_error';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Handle OAuth callback if present
    handleOAuthCallback();
    
    // Initialize auth handler
    new AuthHandler();
});

document.head.insertAdjacentHTML('beforeend', messageStyles);