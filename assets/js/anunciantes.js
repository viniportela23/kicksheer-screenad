// anunciantes.js
document.addEventListener('DOMContentLoaded', () => {
    const loadAnunciantes = async () => {
        const tableBody = document.getElementById('corpo-da-tabela');
        const tituloBody = document.getElementById('titulo-pagina');
        const btnAddBody = document.getElementById('botao-adicao');

        if (!tableBody) return;

        // Limpa o conteúdo atual
        tableBody.innerHTML = '';

        // Adiciona um indicador de carregamento
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando anunciantes...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Lista de anúnciantes</h2>';

        btnAddBody.innerHTML = '<button id="botao-adicao" class="add-new-btn">Adicionar anúncio</button>';

        try {
            // Faz a requisição para a API
            const response = await apiService.request('lista/anuncios', 'POST');
            
            // Limpa a tabela novamente antes de adicionar os dados
            tableBody.innerHTML = '';

            if (!response.dados || response.dados.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum anúncio encontrado</td></tr>';
                return;
            }

            // Processa cada anúncio e adiciona à tabela
            response.dados.forEach(anuncio => {
                const row = document.createElement('tr');
                
                // Formata o status
                const status = anuncio.status === 1 ? 
                    '<span class="status-badge active">Ativo</span>' : 
                    '<span class="status-badge inactive">Inativo</span>';

                const btnStatus = anuncio.status === 1 ? 
                    'class="action-btn deactivate">Desativar' : 
                    'class="action-btn activate">Ativar';

                // Formata as datas
                const dataCriacao = new Date(anuncio.data_criacao).toLocaleDateString();
                const dataFinalizacao = new Date(anuncio.data_finalizacao).toLocaleDateString();
                
                row.innerHTML = `
                    <td>${anuncio.nome}</td>
                    <td>${anuncio.tempo} segundos</td>
                    <td>${dataCriacao}</td>
                    <td>${dataFinalizacao}</td>
                    <td>${status}</td>
                    <td>
                        <button class="action-btn edit">Editar</button>
                        <button ${btnStatus}</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Erro ao carregar anunciantes:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar anúncios: ${error.message}</td></tr>`;
            
            // Mostra notificação de erro
            toastr.error(error.message || 'Erro ao carregar anúncios', 'Erro', {
                timeOut: 5000
            });
        }
    };

    // Chama a função para carregar os anunciantes quando a página é carregada
    loadAnunciantes();
});