async function setupEditLayoutCardapioModal(button) {
  // Obtém o ID do anúncio do atributo do botão
  const idLayout = button.getAttribute('id-layout');
  const url = API_BASE_URL + '/uploads/layouts/';

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
          <div class="form-group">
            <label for="layout-tempo-${idRandom}">Tempo (segundos)</label>
            <input type="number" id="layout-tempo-${idRandom}" value="${layout.tempo || ''}" required>
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
                `<img src="${url}${layout.imagem}" alt="Imagem do anúncio" width="100" style="display: block; margin: 0 auto;">` : 
                '<i class="fas fa-image" style="color: #ccc; font-size: 50px;"></i><br><small>Nenhum arquivo</small>'}
            </div>
            <label for="layout-arquivo-${idRandom}">Novo Arquivo (Foto/Video - Opcional)</label>
            <input type="file" id="layout-arquivo-${idRandom}" accept="image/*, video/*">
          </div>
          <div class="form-group">
            <label for="layout-cor-titulo-${idRandom}">Cor do Titulo</label>
            <input type="color" id="layout-cor-titulo-${idRandom}" value="${layout.cor_titulo || '#ffffff'}">
          </div>
          <div class="form-group">
            <label for="layout-cor-fundo-${idRandom}">Cor de Fundo</label>
            <input type="color" id="layout-cor-fundo-${idRandom}" value="${layout.cor_fundo || '#ffffff'}">
          </div>
          <div class="form-group">
            <label for="layout-cor-nome-${idRandom}">Cor do Nome</label>
            <input type="color" id="layout-cor-nome-${idRandom}" value="${layout.cor_nome || '#000000'}">
          </div>
          <div class="form-group">
            <label for="layout-cor-preco-${idRandom}">Cor do Preço</label>
            <input type="color" id="layout-cor-preco-${idRandom}" value="${layout.cor_preco || '#000000'}">
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
            const tempo = document.getElementById(`layout-tempo-${idRandom}`).value;
            const corTitulo = document.getElementById(`layout-cor-titulo-${idRandom}`).value;
            const corFundo = document.getElementById(`layout-cor-fundo-${idRandom}`).value;
            const corNome = document.getElementById(`layout-cor-nome-${idRandom}`).value;
            const corPreco = document.getElementById(`layout-cor-preco-${idRandom}`).value;

            if (!nome) {
              toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
              });
              return;
            }

            try {
              const response = await apiService.editLayoutCardapio(
                idLayout,
                status, 
                nome,
                arquivo,
                tempo,
                corTitulo, 
                corFundo, 
                corNome,  
                corPreco  
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

function setupGlobalEventListenersLayoutCardapio() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-editar-layout') {
      setupEditLayoutCardapioModal(event.target);
    }
    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-alterar-status-layout') {
      event.preventDefault();
      alterarStatusLayout(event.target);
    }
  });
}

// Função para alterar o status do produto
async function alterarStatusLayout(button) {
  const idLayout = button.getAttribute('id-layout');
  const status = button.getAttribute('acao'); // 1 para ativar, 0 para desativar
  
  try {
    const response = await apiService.editLayoutCardapio(idLayout, status);
    
    toastr.success('Status do layout atualizado com sucesso!', 'Sucesso', {
      timeOut: 5000
    });
    
    // Atualiza a interface conforme necessário
    const anunciantesButton = document.getElementById('btn-layout-cardapio');
    if (anunciantesButton) {
      anunciantesButton.click();
    }
    
  } catch (error) {
    console.error('Erro ao alterar status do layout:', error);
    toastr.error(error.message || 'Erro ao alterar status do layout', 'Erro', {
      timeOut: 5000
    });
  }
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersLayoutCardapio);