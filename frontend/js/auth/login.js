document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email) || !password) {
        showError('Please fill all fields correctly');
        return;
    }

    try {
        const response = await loginUser(email, password);
        
        if (response.userId && response.token) {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('token', response.token);
            window.location.href = 'index.html';
        } else {
            showError(response.message || 'Login failed');
        }
    } catch (error) {
        showError(error.message);
    }
});

document.getElementById('register-link').addEventListener('click', () => {
    window.location.href = 'register.html';
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.auth-form').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}