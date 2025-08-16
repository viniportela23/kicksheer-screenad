document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            //const remember = document.getElementById('remember').checked;
            
            // Variável originalText precisa ser declarada fora do try para ser acessível no catch
            let originalText;
            const loginButton = e.target.querySelector('button[type="submit"]');
            
            try {
                if (loginButton) {
                    originalText = loginButton.textContent;
                    loginButton.disabled = true;
                    loginButton.textContent = 'Autenticando...';
                }

                //const response = await apiService.login(username, password, remember);

                const response = await apiService.login(username, password);
                                
                // Notificação de sucesso
                window.location.href = './dashboard.html';
                
            } catch (error) {
                console.error('Erro:', error);
                
                // Notificação de erro
                toastr.error(error.message || 'Erro ao fazer login', 'Erro', {
                    timeOut: 5000
                });
                
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.textContent = originalText;
                }
            }
        });
    }
});
function checkAuthAndRedirect() {
    const token = AuthService.getToken();
    if (token) {
        // Se houver um token, redireciona para a dashboard
        window.location.href = './dashboard.html';
    }
    // Se não houver token, o usuário permanece na página atual
}

// Adiciona o event listener para quando a página carregar
window.addEventListener('DOMContentLoaded', checkAuthAndRedirect);
