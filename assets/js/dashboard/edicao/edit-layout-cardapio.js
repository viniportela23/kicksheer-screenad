async function setupEditLayoutCardapioModal(button) {
  // Obtém o ID do anúncio do atributo do botão
  const idLayout = button.getAttribute('id-layout');
  
  try {
    // Busca os dados do anúncio
    const response = await apiService.layoutCardapio(idLayout);
    const layout = response.dados;
    const idRandom = Math.random();
        
    // Cria o modal com os dados preenchidos e IDs dinâmicos
    const modal = modalDashboard({
      title: 'Editar Anunciante',
      content: `
        <form id="form-layout-${idRandom}">
          <div class="form-group">
            <label for="layout-nome-${idRandom}">Nome</label>
            <input type="text" id="layout-nome-${idRandom}" value="${layout.nome || ''}" required>
          </div>
          <div class="form-group switch-group">
            <label for="layout-status-${idRandom}">Status</label>
            <label class="switch">
              <input type="checkbox" id="layout-status-${idRandom}" ${layout.status == 1 ? 'checked' : ''}>
              <span class="slider round" id="layout-status2-${idRandom}"></span>
            </label>
          </div>
          <div class="form-group">
            <label>Arquivo Atual</label>
            <div style="text-align: center; margin-bottom: 10px;">
              ${layout.imagem ? 
                `<img src="http://192.168.0.104/api/uploads/layouts/${layout.imagem}" alt="Imagem do anúncio" width="100" style="display: block; margin: 0 auto;">` : 
                '<i class="fas fa-image" style="color: #ccc; font-size: 50px;"></i><br><small>Nenhum arquivo</small>'}
            </div>
            <label for="layout-arquivo-${idRandom}">Novo Arquivo (Foto/Video - Opcional)</label>
            <input type="file" id="layout-arquivo-${idRandom}" accept="image/*, video/*">
          </div>
        </form>
      `,
      buttons: [
        {
          text: 'Cancelar',
          class: 'cancel-btn',
          handler: () => modal.close()
        },
        {
          text: 'Salvar',
          class: 'save-btn',
          handler: async () => {
            const nome = document.getElementById(`layout-nome-${idRandom}`).value;
            const status = document.getElementById(`layout-status-${idRandom}`).checked ? 1 : 0;
            const arquivoInput = document.getElementById(`layout-arquivo-${idRandom}`);
            const arquivo = arquivoInput.files.length > 0 ? arquivoInput.files[0] : null;

            if (!nome) {
              toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
              });
              return;
            }

            try {
              const response = await apiService.editLayoutCardapio(
                idLayout, 
                nome, 
                status, 
                arquivo
              );
              
              toastr.success('Layout atualizado com sucesso!', 'Sucesso', {
                timeOut: 5000
              });
              
              modal.close();
              const anunciantesButton = document.getElementById('btn-layout-cardapio');
              if (anunciantesButton) {
                anunciantesButton.click();
              }
            } catch (error) {
              console.error('Erro ao atualizar layout:', error);
              toastr.error(error.message || 'Erro ao atualizar layout', 'Erro', {
                timeOut: 5000
              });
            }
          }
        }
      ]
    });

    modal.open();
    
  } catch (error) {
    console.error('Erro ao carregar dados do layout:', error);
    toastr.error('Erro ao carregar dados do layout', 'Erro', {
      timeOut: 5000
    });
  }
}

// Configura o event delegation
function setupGlobalEventListenersLayoutCardapio() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-editar-layout') {
      setupEditLayoutCardapioModal(event.target);
    }
  });
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersLayoutCardapio);