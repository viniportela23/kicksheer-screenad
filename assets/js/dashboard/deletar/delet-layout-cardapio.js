function setupGlobalEventListenersLayoutCardapio() {
  document.addEventListener('click', function(event) {    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-deletar-layout') {
      event.preventDefault();
      deletarLayout(event.target);
    }
  });
}

// Função para alterar o status do produto
async function deletarLayout(button) {
  const idLayout = button.getAttribute('id-layout');
  
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
      const response = await apiService.deletLayoutCardapio(idLayout);
      
      toastr.success('Layout deletado com sucesso!', 'Sucesso', {
        timeOut: 5000
      });
      
      // Atualiza a interface conforme necessário
      const anunciantesButton = document.getElementById('btn-layout-cardapio');
      if (anunciantesButton) {
        anunciantesButton.click();
      }
      
    } catch (error) {
      console.error('Erro ao deletar layout:', error);
      toastr.error(error.message || 'Erro ao deletar layout', 'Erro', {
        timeOut: 5000
      });
    }
  }
}



// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersLayoutCardapio);