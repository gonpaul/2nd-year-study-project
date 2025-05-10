const MatrixController = require('../js/controllers/MatrixController');

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return; 
    }

    new MatrixController();

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});