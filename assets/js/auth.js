// Certifique-se de carregar os serviços primeiro
// Se estiver usando módulos:
// import { apiService, AuthService } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            try {
                const loginButton = e.target.querySelector('button[type="submit"]');
                const originalText = loginButton.textContent;
                loginButton.disabled = true;
                loginButton.textContent = 'Autenticando...';

                const response = await apiService.login(username, password, remember);
                
                AuthService.setToken(response.token, remember);
                window.location.href = '/dashboard.html';
                
            } catch (error) {
                console.error('Erro:', error);
                alert(error.message || 'Erro ao fazer login');
                
                const loginButton = e.target.querySelector('button[type="submit"]');
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.textContent = originalText;
                }
            }
        });
    }
});
