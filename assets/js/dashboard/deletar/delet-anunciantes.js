// Configura o event delegation
function setupGlobalEventListenersAnunciantes() {
  document.addEventListener('click', function(event) {    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-deletar-anunciante') {
      event.preventDefault();
      deletarAnunciante(event.target);
    }
  });
}

// Função para alterar o status do produto
async function deletarAnunciante(button) {
  const idAnunciante = button.getAttribute('id-anunciante');
  
  // Mostra o modal de confirmação
  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter isso!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, deletar!',
    cancelButtonText: 'Cancelar'
  });
  
  // Se o usuário confirmar, prossegue com a deleção
  if (result.isConfirmed) {
    try {
      const response = await apiService.deletAnunciantes(idAnunciante);
      
      toastr.success('Anunciante deletado com sucesso!', 'Sucesso', {
        timeOut: 5000
      });
      
      // Atualiza a interface conforme necessário
      const anunciantesButton = document.getElementById('btn-anunciantes');
      if (anunciantesButton) {
        anunciantesButton.click();
      }
      
    } catch (error) {
      console.error('Erro ao deletar anunciante:', error);
      toastr.error(error.message || 'Erro ao deletar anunciante', 'Erro', {
        timeOut: 5000
      });
    }
  }
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersAnunciantes);