async function setupEditAnunciantesModal(button) {
  // Obtém o ID do anúncio do atributo do botão
  const idAnunciante = button.getAttribute('id-anunciante');
  
  try {
    // Busca os dados do anúncio
    const response = await apiService.anunciantes(idAnunciante);
    const anuncio = response.dados;
    const idRandom = Math.random();
    
    // Formata a data para o input type="date"
    const dataFinalizacaoFormatada = anuncio.data_finalizacao ? anuncio.data_finalizacao.split(' ')[0] : '';
    
    // Cria o modal com os dados preenchidos e IDs dinâmicos
    const modal = modalDashboard({
      title: 'Editar Anunciante',
      content: `
        <form id="form-anunciante-${idRandom}">
          <div class="form-group">
            <label for="anunciante-nome-${idRandom}">Nome</label>
            <input type="text" id="anunciante-nome-${idRandom}" value="${anuncio.nome || ''}" required>
          </div>
          <div class="form-group">
            <label for="anunciante-tempo-${idRandom}">Tempo (segundos)</label>
            <input type="number" id="anunciante-tempo-${idRandom}" value="${anuncio.tempo || ''}" required>
          </div>
          <div class="form-group">
            <label for="anunciante-data-${idRandom}">Data Finalização</label>
            <input type="date" id="anunciante-data-${idRandom}" value="${dataFinalizacaoFormatada}" required>
          </div>
          <div class="form-group switch-group">
            <label for="anunciante-status-${idRandom}">Status</label>
            <label class="switch">
              <input type="checkbox" id="anunciante-status-${idRandom}" ${anuncio.status == 1 ? 'checked' : ''}>
              <span class="slider round" id="anunciante-status2-${idRandom}"></span>
            </label>
          </div>
          <div class="form-group">
            <label>Arquivo Atual</label>
            <div style="text-align: center; margin-bottom: 10px;">
              ${anuncio.arquivo ? 
                `<img src="http://192.168.0.104/api/uploads/anunciantes/${anuncio.arquivo}" alt="Imagem do anúncio" width="100" style="display: block; margin: 0 auto;">` : 
                '<i class="fas fa-image" style="color: #ccc; font-size: 50px;"></i><br><small>Nenhum arquivo</small>'}
            </div>
            <label for="anunciante-arquivo-${idRandom}">Novo Arquivo (Foto/Video - Opcional)</label>
            <input type="file" id="anunciante-arquivo-${idRandom}" accept="image/*, video/*">
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
            const nome = document.getElementById(`anunciante-nome-${idRandom}`).value;
            const tempo = parseInt(document.getElementById(`anunciante-tempo-${idRandom}`).value);
            const data_finalizacao = document.getElementById(`anunciante-data-${idRandom}`).value;
            const status = document.getElementById(`anunciante-status-${idRandom}`).checked ? 1 : 0;
            const arquivoInput = document.getElementById(`anunciante-arquivo-${idRandom}`);
            const arquivo = arquivoInput.files.length > 0 ? arquivoInput.files[0] : null;

            if (!nome || !tempo || !data_finalizacao) {
              toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
              });
              return;
            }

            try {
              const response = await apiService.editAnunciantes(
                idAnunciante, 
                status,
                nome,
                tempo,
                data_finalizacao, 
                arquivo
              );
              
              toastr.success('Anunciante atualizado com sucesso!', 'Sucesso', {
                timeOut: 5000
              });
              
              modal.close();
              const anunciantesButton = document.getElementById('btn-anunciantes');
              if (anunciantesButton) {
                anunciantesButton.click();
              }
            } catch (error) {
              console.error('Erro ao atualizar anunciante:', error);
              toastr.error(error.message || 'Erro ao atualizar anunciante', 'Erro', {
                timeOut: 5000
              });
            }
          }
        }
      ]
    });

    modal.open();
    
  } catch (error) {
    console.error('Erro ao carregar dados do anúncio:', error);
    toastr.error('Erro ao carregar dados do anúncio', 'Erro', {
      timeOut: 5000
    });
  }
}

// Configura o event delegation
function setupGlobalEventListenersAnunciantes() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-editar-anunciante') {
      setupEditAnunciantesModal(event.target);
    }
  });
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersAnunciantes);