document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('.logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogoutClick);
  }
});

// Função 1: Captura do clique e prevenção do comportamento padrão
function handleLogoutClick(e) {
  e.preventDefault();
  clearAuthData(); // Chama a função de limpeza
  redirectToLogin(); // Redireciona após limpar os dados
}

// Função 2: Limpeza dos dados de autenticação (reutilizável)
function clearAuthData() {
  // Remove do localStorage
  localStorage.removeItem('authToken');
  
  // Remove dos cookies
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('Dados de autenticação removidos.');
}

// Função 3: Redirecionamento (opcional, também reutilizável)
function redirectToLogin() {
  window.location.href = 'index.html'; // ou '/login.html'
}