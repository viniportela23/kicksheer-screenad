const loadProdutosCardapio = async () => {
    try {
        // Executa todas as requisições em paralelo
        const [anunciantes, produtos, layout] = await Promise.all([
            apiService.anunciantes(null, 1),
            apiService.prodCardapio(null, 1),
            apiService.layoutCardapio(null, 1)
        ]);

        // Retorna os dados agrupados
        return {
            anunciantes,
            produtos,
            layout
        };

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);

        // Mostra notificação de erro
        toastr.error(error.message || 'Erro ao carregar produtos', 'Erro', {
            timeOut: 5000
        });

        return null; // em caso de erro, retorna null
    }
};

// Função para iniciar todo o processo
const iniciarProcessoAnuncios = async () => {
    try {
        const dados = await loadProdutosCardapio();
        if (!dados) return;
        
        // Organiza os dados
        const dadosOrganizados = organizaDados(dados);
        
        // Inicia a exibição
        iniciarExibicaoAnuncios(dadosOrganizados);
        
    } catch (error) {
        console.error('Erro no processo de anúncios:', error);
        toastr.error('Erro ao processar anúncios', 'Erro');
    }
};

// Inicia o processo quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarProcessoAnuncios);