function handleAddLayoutCardapioClick() {
  const modal = modalDashboard({
    title: 'Adicionar Anunciante',
    content: `
      <form id="form-anunciante">
        <div class="form-group">
          <label for="anunciante-nome">Nome</label>
          <input type="text" id="anunciante-nome" required>
        </div>
        <div class="form-group switch-group">
          <label for="anunciante-status">Status</label>
          <label class="switch">
            <input type="checkbox" id="anunciante-status">
            <span class="slider round"></span>
          </label>
        </div>
        <div class="form-group">
          <label for="anunciante-arquivo">Arquivo (Foto/Video)</label>
          <input type="file" id="anunciante-arquivo" accept="image/*, video/*">
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
          const nome = document.getElementById('anunciante-nome').value;
          const status = document.getElementById('anunciante-status').checked ? 1 : 0;
          const arquivo = document.getElementById('anunciante-arquivo').files[0];

          if (!nome || !arquivo) {

            toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
            });
            return;
          }

          try {
            const response = await apiService.addLayoutCardapio(nome, arquivo, status);
            toastr.success('Anunciante adicionado com sucesso!', 'Sucesso', {
                timeOut: 5000
            });
            modal.close();
            const anunciantesButton = document.getElementById('btn-layout-cardapio');
            if (anunciantesButton) {
              anunciantesButton.click();
            }
          } catch (error) {
            console.error('Erro ao adicionar anunciante:', error);
            toastr.error(error.message || 'Erro ao adicionar anunciante', 'Erro', {
                timeOut: 5000
            });
          }
        }
      }
    ]
  });

  modal.open();
}
// Configura o event delegation
function setupGlobalEventListenersLayoutCardapio() {
  // Event delegation para o botão de adicionar produto
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-adicionar-layout-cardapio') {
      handleAddLayoutCardapioClick();
    }
  });
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersLayoutCardapio);