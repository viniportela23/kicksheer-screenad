
function setupAddAnunciantesModal() {
  const modal = modalDashboard({
    title: 'Adicionar Anunciante',
    content: `
      <form id="form-anunciante">
        <div class="form-group">
          <label for="anunciante-nome">Nome</label>
          <input type="text" id="anunciante-nome" required>
        </div>
        <div class="form-group">
          <label for="anunciante-tempo">Tempo (segundos)</label>
          <input type="number" id="anunciante-tempo" required>
        </div>
        <div class="form-group">
          <label for="anunciante-data">Data Finalização</label>
          <input type="date" id="anunciante-data" required>
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
          const tempo = parseInt(document.getElementById('anunciante-tempo').value);
          const data_finalizacao = document.getElementById('anunciante-data').value;
          const status = document.getElementById('anunciante-status').checked ? 1 : 0;
          const arquivo = document.getElementById('anunciante-arquivo').files[0];

          if (!nome || !tempo || !data_finalizacao || !arquivo) {

            toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
            });
            return;
          }

          try {
            const response = await apiService.addAnunciantes(nome, arquivo, tempo, data_finalizacao, status);
            toastr.success('Anunciante adicionado com sucesso!', 'Sucesso', {
                timeOut: 5000
            });
            modal.close();
            const anunciantesButton = document.getElementById('btn-anunciantes');
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
function setupGlobalEventListenersAnunciantes() {
  // Event delegation para o botão de adicionar produto
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-adicionar-anunciante') {
      setupAddAnunciantesModal();
    }
  });
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersAnunciantes);