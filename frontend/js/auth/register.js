document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !validateEmail(email) || password.length < 6) {
        showError('Please fill all fields correctly (min 6 chars for password)');
        return;
    }

    try {
        const response = await registerUser(username, email, password);
        
        if (response.userId) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            showError(response.message || 'Registration failed');
        }
    } catch (error) {
        showError(error.message);
    }
});

document.getElementById('login-link').addEventListener('click', () => {
    window.location.href = 'login.html';
});