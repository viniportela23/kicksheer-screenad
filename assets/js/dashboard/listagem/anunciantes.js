// anunciantes.js
document.addEventListener('DOMContentLoaded', () => {

    // Função para verificar se o cookie existe
    const hasNotificationCookieAnunciantes = () => {
        return document.cookie.split(';').some(cookie => 
            cookie.trim().startsWith('anunciantes_notification_shown=')
        );
    };

    // Função para criar o cookie
    const setNotificationCookieAnunciantes = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 10); // 10 anos a partir de agora
        document.cookie = `anunciantes_notification_shown=true; expires=${date.toUTCString()}; path=/`;
    };

    // Função para verificar se a data de finalização é maior que hoje
    const isDataFinalizacaoValida = (dataFinalizacao) => {
        const hoje = new Date();
        const dataFinal = new Date(dataFinalizacao);
        // Remove a parte de tempo para comparar apenas as datas
        hoje.setHours(0, 0, 0, 0);
        dataFinal.setHours(0, 0, 0, 0);
        return dataFinal > hoje;
    };

    // Função para carregar anunciantes
    const loadAnunciantes = async () => {
        if (!hasNotificationCookieAnunciantes()) {
            // Mostra o modal de confirmação apenas se o cookie não existir
            const respostaConfirmada = await Swal.fire({
                title: 'ATENÇÃO!',
                text: 'Para que o anúncio apareça, é necessário que a data de finalização seja maior que a data atual.',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Sim, entendo!'
            });
            // Se o usuário confirmou, cria o cookie
            if (respostaConfirmada) {
                setNotificationCookieAnunciantes();
            } else {
                // Se cancelou, não continua o processo
                return;
            }
        }

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

        cabecalhoTableBody.innerHTML = '<tr><th>Nome</th><th>Tempo</th><th>Data Criação</th><th>Data Finalização</th><th>Status</th><th style="width: 240px;">Ações</th></tr>';

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
                
                // Formata as datas
                const dataCriacao = new Date(anuncio.data_criacao).toLocaleDateString();
                const dataFinalizacao = new Date(anuncio.data_finalizacao).toLocaleDateString();
                
                // Verifica se a data de finalização é válida
                const dataValida = isDataFinalizacaoValida(anuncio.data_finalizacao);
                
                let status, btnStatus;
                
                if (anuncio.status === 1) {
                    if (dataValida) {
                        // Status 1 e data válida: Ativo
                        status = '<span class="status-badge active">Ativo</span>';
                        btnStatus = `id-anunciante="${anuncio.id}" class="action-btn deactivate" acao="0">Desativar`;
                    } else {
                        // Status 1 mas data inválida: Inativo com warning
                        status = '<span class="status-badge warning">Inativo</span>';
                        btnStatus = `id-anunciante="${anuncio.id}" class="action-btn warning" acao="1">Ativar`;
                    }
                } else {
                    // Status 0: Inativo normal
                    status = '<span class="status-badge inactive">Inativo</span>';
                    btnStatus = `id-anunciante="${anuncio.id}" class="action-btn activate" acao="1">Ativar`;
                }
                
                row.innerHTML = `
                    <td>${anuncio.nome}</td>
                    <td>${anuncio.tempo} segundos</td>
                    <td>${dataCriacao}</td>
                    <td>${dataFinalizacao}</td>
                    <td>${status}</td>
                    <td style="width: 280px;">
                        <button id="btn-editar-anunciante" id-anunciante="${anuncio.id}" class="action-btn edit">Editar</button>
                        <button id="btn-alterar-status-anunciante" ${btnStatus}</button>
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