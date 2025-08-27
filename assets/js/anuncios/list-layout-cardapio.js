const loadLayoutCardapio = async () => {

    try {
        // Faz a requisição para a API
        const response = await apiService.layoutCardapio();
        
        
    } catch (error) {
        console.error('Erro ao carregar layouts:', error);
        tableBody.innerHTML = `<div><h1>Erro ao carregar layouts: ${error.message}</h1></div>`;
        
        // Mostra notificação de erro
        toastr.error(error.message || 'Erro ao carregar layouts', 'Erro', {
            timeOut: 5000
        });
    }
};
