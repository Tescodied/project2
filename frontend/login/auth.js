
// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function () {
        const tabName = this.dataset.tab;

        // Update active tab
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Show corresponding form
        document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    });
});

// Toggle form links
document.querySelectorAll('[data-toggle]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetTab = this.dataset.toggle;

        // Trigger tab switch
        document.querySelector(`[data-tab="${targetTab}"]`).click();
    });
});

// User type selection
document.querySelectorAll('.user-type').forEach(type => {
    type.addEventListener('click', function () {
        const container = this.closest('.form-section');
        const userType = this.dataset.type;

        // Update selected state
        container.querySelectorAll('.user-type').forEach(t => t.classList.remove('selected'));
        this.classList.add('selected');

        // Show/hide form fields for signup
        if (container.id === 'signup') {
            const teacherFields = document.getElementById('teacherFields');
            const studentFields = document.getElementById('studentFields');

            if (userType === 'teacher') {
                teacherFields.style.display = 'block';
                studentFields.style.display = 'none';
            } else {
                teacherFields.style.display = 'none';
                studentFields.style.display = 'block';
            }
        }
    });
});

// Form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.querySelector('#login .user-type.selected').dataset.type;

    // Simulate login process
    console.log('Login:', { email, password, userType });

    // Add loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
        alert('Login successful! (This is a demo)');
    }, 1500);
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userType = document.querySelector('#signup .user-type.selected').dataset.type;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Password validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Collect form data based on user type
    let formData = { userType, password };

    if (userType === 'teacher') {
        formData = {
            ...formData,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            school: document.getElementById('school').value,
            subject: document.getElementById('subject').value,
            grade: document.getElementById('grade').value
        };
    } else {
        formData = {
            ...formData,
            firstName: document.getElementById('studentFirstName').value,
            lastName: document.getElementById('studentLastName').value,
            email: document.getElementById('studentEmail').value,
            classCode: document.getElementById('classCode').value,
            grade: document.getElementById('studentGrade').value
        };
    }

    console.log('Signup:', formData);

    // Add loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
        alert('Account created successfully! (This is a demo)');
    }, 2000);
});

// Social login buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const provider = this.textContent.trim();
        alert(`${provider} login not implemented yet (This is a demo)`);
    });
});

// Forgot password
document.getElementById('forgotPassword').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Password reset functionality not implemented yet (This is a demo)');
});