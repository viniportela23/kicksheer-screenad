const loadProdutosCardapio = async () => {

    try {
        // Faz a requisição para a API
        const response = await apiService.prodCardapio();
        

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        tableBody.innerHTML = `<div><h1>Erro ao carregar produtos: ${error.message}</h1></div>`;
        
        // Mostra notificação de erro
        toastr.error(error.message || 'Erro ao carregar produtos', 'Erro', {
            timeOut: 5000
        });
    }
};