document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('.logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogoutClick);
  }
});

// Função 1: Captura do clique e prevenção do comportamento padrão
async function handleLogoutClick(e) { // Adicionei async aqui
    // Mostra o modal de confirmação
  const result = await Swal.fire({
    title: 'Tem certeza que deseja sair?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, sair!',
    cancelButtonText: 'Cancelar'
  });
  
  // Se o usuário confirmar, prossegue com a deleção
  if (result.isConfirmed) {
    e.preventDefault();
    clearAuthData(); // Chama a função de limpeza
    redirectToLogin(); // Redireciona após limpar os dados
  }
}
// Função 2: Limpeza dos dados de autenticação (reutilizável)
function clearAuthData() {
  
  // Remove dos cookies
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('Dados de autenticação removidos.');
}

// Função 3: Redirecionamento (opcional, também reutilizável)
function redirectToLogin() {
  window.location.href = 'index.html'; // ou '/login.html'
}