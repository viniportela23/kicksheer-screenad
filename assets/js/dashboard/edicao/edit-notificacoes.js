// notificacoes-handler.js
document.addEventListener('DOMContentLoaded', () => {
  // Função para lidar com o clique em "Ver" notificação
  function handleVerNotificacaoClick() {
    document.addEventListener('click', async (event) => {
      if (event.target.id === 'btn-ver-notificacao') {
        const notificacaoItem = event.target.closest('.notificacao-item');
        const idNotificacao = event.target.getAttribute('id-notificacao');
        const acao = event.target.getAttribute('acao');
        
        // Verificar se a notificação não foi lida
        if (notificacaoItem && notificacaoItem.classList.contains('nao-lida')) {
          try {
            // Marcar como lida
            const response = await apiService.editNotificacoes(idNotificacao, 0);
            console.log('Notificação marcada como lida:', response);
          } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
          }
        }
        
        // Redirecionar para a ação independentemente do resultado
        if (acao) {
          window.location.href = acao;
        }
      }
    });
  }

  // Função para lidar com o clique em "Marcar todas como lidas"
  function handleMarcarTodasLidasClick() {
    document.addEventListener('click', async (event) => {
      if (event.target.id === 'marcar-todas-lidas') {
        // Encontrar todas as notificações não lidas
        const notificacoesNaoLidas = document.querySelectorAll('.notificacao-item.nao-lida');
        const idsParaMarcar = [];
        
        // Coletar IDs das notificações não lidas
        notificacoesNaoLidas.forEach(notificacao => {
          const btnVer = notificacao.querySelector('.notificacao-content');
          if (btnVer) {
            const idNotificacao = btnVer.getAttribute('id-notificacao');
            idsParaMarcar.push(idNotificacao);
          }
        });
        
        // Marcar todas como lidas
        if (idsParaMarcar.length > 0) {
          try {
            // Fazer chamada para marcar todas como lidas
            // Nota: Você precisará ajustar sua API para aceitar um array de IDs
            const response = await apiService.editNotificacoes(idsParaMarcar, 0);
            console.log('Todas as notificações marcadas como lidas:', response);
            
            const anunciantesButton = document.getElementById('btn-notificacoes');
            if (anunciantesButton) {
              anunciantesButton.click();
            }

            
          } catch (error) {
            console.error('Erro ao marcar notificações como lidas:', error);
          }
        }
      }
    });
  }

  // Inicializar os event listeners
  function init() {
    handleVerNotificacaoClick();
    handleMarcarTodasLidasClick();
  }

  // Iniciar quando o DOM estiver pronto
  init();
});