document.addEventListener('DOMContentLoaded', () => {

  async function loadNotificacoes() {
    
    try {
      const response = await apiService.notificacoes();
            
      // Get user data from response
      const userData = response.dados[0];
      
      const notificacoesElement = document.getElementById('btn-notificacoes');
      if (notificacoesElement) {
        
        notificacoesElement.innerHTML = `aqui vai o html`;
      }

    } catch (error) {
      console.error('Erro ao buscar dados das notificacoes:', error);
      toastr.error(error.message || 'Erro ao buscar dados das notificacoes', 'Erro', {
        timeOut: 5000
      });
    }
  }

  loadNotificacoes();
});