document.addEventListener('DOMContentLoaded', () => {

  async function loadDadosUser() {
    
    try {
      const response = await apiService.usuario();
            
      // Get user data from response
      const userData = response.dados[0];
      const numNotificacoes = response.notificacoes;

      // Format and display username
      const nomeUserElement = document.getElementById('nome-user');
      if (nomeUserElement) {
        const formattedName = userData.username
          .split(' ')
          .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
          .join(' ');
        nomeUserElement.innerHTML = `<span>Bem-vindo, ${formattedName}</span>`;
      }
      
      const vencimentoElement = document.getElementById('vencimento-user');
      if (vencimentoElement) {
        // Divide a data em partes para evitar problemas de timezone
        const [year, month, day] = userData.vencimento.split('-');
        const vencimentoDate = new Date(year, month - 1, day); // mês é 0-indexed
        
        const formattedDate = vencimentoDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        vencimentoElement.innerHTML = `<span>Vencimento: ${formattedDate}</span>`;
      }

      const notificacaoNumElement = document.getElementById('numero-notificacoes');
      if (notificacaoNumElement) {
        notificacaoNumElement.innerHTML = `<span class="notification-badge">${numNotificacoes}</span>`;
      }

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      toastr.error(error.message || 'Erro ao buscar dados do usuário', 'Erro', {
        timeOut: 5000
      });
    }
  }

  loadDadosUser();
});