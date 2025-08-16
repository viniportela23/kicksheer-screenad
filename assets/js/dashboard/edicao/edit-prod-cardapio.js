async function setupEditProdCardapioModal(button) {
  // Obtém o ID do anúncio do atributo do botão
  const idProduto = button.getAttribute('id-produto');
  
  try {
    // Busca os dados do anúncio
    const response = await apiService.prodCardapio(idProduto);
    const produto = response.dados;
    const idRandom = Math.random();
        
    // Cria o modal com os dados preenchidos e IDs dinâmicos
    const modal = modalDashboard({
      title: 'Editar Anunciante',
      content: `
        <form id="form-produto-${idRandom}">
          <div class="form-group">
            <label for="produto-nome-${idRandom}">Nome</label>
            <input type="text" id="produto-nome-${idRandom}" value="${produto.nome || ''}" required>
          </div>
          <div class="form-group">
            <label for="produto-preco-${idRandom}">Preço</label>
            <input type="number" id="produto-preco-${idRandom}" step="0.01" min="0" value="${produto.preco || ''}" required>
          </div>

          <div class="form-group switch-group">
            <label for="produto-status-${idRandom}">Status</label>
            <label class="switch">
              <input type="checkbox" id="produto-status-${idRandom}" ${produto.status == 1 ? 'checked' : ''}>
              <span class="slider round" id="produto-status2-${idRandom}"></span>
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
            const nome = document.getElementById(`produto-nome-${idRandom}`).value;
            const precoInput = document.getElementById(`produto-preco-${idRandom}`).value;
            const preco = parseFloat(precoInput.replace(',', '.'));
            const status = document.getElementById(`produto-status-${idRandom}`).checked ? 1 : 0;

            if (!nome || !precoInput) {
              toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
              });
              return;
            }

            try {
              const response = await apiService.editProdCardapio(
                idProduto,
                status, 
                nome, 
                preco
              );
              
              toastr.success('Produto atualizado com sucesso!', 'Sucesso', {
                timeOut: 5000
              });
              
              modal.close();
              const anunciantesButton = document.getElementById('btn-prod-cardapio');
              if (anunciantesButton) {
                anunciantesButton.click();
              }
            } catch (error) {
              console.error('Erro ao atualizar produto:', error);
              toastr.error(error.message || 'Erro ao atualizar produto', 'Erro', {
                timeOut: 5000
              });
            }
          }
        }
      ]
    });

    modal.open();
    
  } catch (error) {
    console.error('Erro ao carregar dados do produto:', error);
    toastr.error('Erro ao carregar dados do produto', 'Erro', {
      timeOut: 5000
    });
  }
}

// Configura o event delegation
function setupGlobalEventListenersProdCardapio() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-editar-produto') {
      setupEditProdCardapioModal(event.target);
    }
    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-alterar-status-produto') {
      event.preventDefault();
      alterarStatusProduto(event.target);
    }
  });
}

// Função para alterar o status do produto
async function alterarStatusProduto(button) {
  const idProduto = button.getAttribute('id-produto');
  const status = button.getAttribute('acao'); // 1 para ativar, 0 para desativar
  
  try {
    const response = await apiService.editProdCardapio(idProduto, status);
    
    toastr.success('Status do produto atualizado com sucesso!', 'Sucesso', {
      timeOut: 5000
    });
    
    // Atualiza a interface conforme necessário
    const anunciantesButton = document.getElementById('btn-prod-cardapio');
    if (anunciantesButton) {
      anunciantesButton.click(); // Recarrega a lista de produtos
    }
    
  } catch (error) {
    console.error('Erro ao alterar status do produto:', error);
    toastr.error(error.message || 'Erro ao alterar status do produto', 'Erro', {
      timeOut: 5000
    });
  }
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersProdCardapio);