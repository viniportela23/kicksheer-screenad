const loadAnunciantes = async () => {

    try {
        // Faz a requisição para a API
        const response = await apiService.anunciantes();
        

    } catch (error) {
        console.error('Erro ao carregar anunciantes:', error);
        tableBody.innerHTML = `<div><h1>Erro ao carregar anúncios: ${error.message}</h1></div>`;
        
        // Mostra notificação de erro
        toastr.error(error.message || 'Erro ao carregar anúncios', 'Erro', {
            timeOut: 5000
        });
    }
};