function handleAddProdCardapioClick() {
  const modal = modalDashboard({
    title: 'Adicionar Produto do Cardapio',
    content: `
      <form id="form-anunciante">
        <div class="form-group">
          <label for="prod-cardapio-nome">Nome</label>
          <input type="text" id="prod-cardapio-nome" required>
        </div>
        <div class="form-group">
          <label for="prod-cardapio-preco">Preço</label>
          <input type="number" id="prod-cardapio-preco" step="0.01" min="0" required>
        </div>
        <div class="form-group switch-group">
          <label for="prod-cardapio-status">Status</label>
          <label class="switch">
            <input type="checkbox" id="prod-cardapio-status">
            <span class="slider round"></span>
          </label>
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
          const nome = document.getElementById('prod-cardapio-nome').value;
          const precoInput = document.getElementById('prod-cardapio-preco').value;
          const preco = parseFloat(precoInput.replace(',', '.'));
          const status = document.getElementById('prod-cardapio-status').checked ? 1 : 0;

          if (!nome || !precoInput) {
            toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
              timeOut: 5000
            });
            return;
          }

          try {
            const response = await apiService.addProdCardapio(nome, preco, status);
            toastr.success('Produto do cardapio adicionado com sucesso!', 'Sucesso', {
              timeOut: 5000
            });
            modal.close();
            const anunciantesButton = document.getElementById('btn-prod-cardapio');
            if (anunciantesButton) {
              anunciantesButton.click();
            }
          } catch (error) {
            console.error('Erro ao adicionar produto do cardapio:', error);
            toastr.error(error.message || 'Erro ao adicionar produto do cardapio', 'Erro', {
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
function setupGlobalEventListenersProdCardapio() {
  // Event delegation para o botão de adicionar produto
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-adicionar-prod-cardapio') {
      handleAddProdCardapioClick();
    }
  });
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersProdCardapio);