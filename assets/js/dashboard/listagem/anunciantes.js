// anunciantes.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Função para carregar anunciantes
    const loadAnunciantes = async () => {
        const cabecalhoTableBody = document.getElementById('cabecalho-da-tabela');
        const tableBody = document.getElementById('corpo-da-tabela');
        const tituloBody = document.getElementById('titulo-pagina');
        const btnAddBody = document.getElementById('botao-adicao');
        const btnListaAnunciantesBody = document.getElementById('div-anunciantes');

        if (!tableBody) return;

        // Limpa o conteúdo atual
        cabecalhoTableBody.innerHTML = '';
        tableBody.innerHTML = '';
        tituloBody.innerHTML = '';
        btnAddBody.innerHTML = '';

        btnListaAnunciantesBody.innerHTML = '<a href="#" id="btn-anunciantes" class="menu-item"><span>Lista de anúnciantes</span></a>';
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        btnListaAnunciantesBody.querySelector('.menu-item').classList.add('active');

        cabecalhoTableBody.innerHTML = '<tr><th>Nome</th><th>Tempo</th><th>Data Criação</th><th>Data Finalização</th><th>Status</th><th>Ações</th></tr>';

        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando anunciantes...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Lista de anúnciantes</h2>';

        btnAddBody.innerHTML = '<button id="btn-adicionar-anunciante" class="add-new-btn">Adicionar anunciantes</button>';

        try {
            // Faz a requisição para a API
            const response = await apiService.anunciantes();
            
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
                        <button id="btn-editar-anunciante" id-anunciante="${anuncio.id}" class="action-btn edit">Editar</button>
                        <button id="btn-alterar-status-anunciante" id-anunciante="${anuncio.id}" ${btnStatus}</button>
                        <button id="btn-deletar-anunciante" id-anunciante="${anuncio.id}" class="action-btn delete">Excluir</button>
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

    // Adiciona o event listener para o botão
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-anunciantes')) {
            e.preventDefault();
            await loadAnunciantes();
        }
    });

    // Chama a função para carregar os anunciantes quando a página é carregada
    loadAnunciantes();
});