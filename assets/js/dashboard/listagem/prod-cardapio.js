// prodCardapio.js
document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-prod-cardapio')) {
            e.preventDefault();
            await loadProdutosCardapio();
        }
    });

    const loadProdutosCardapio = async () => {
        const cabecalhoTableBody = document.getElementById('cabecalho-da-tabela');
        const tableBody = document.getElementById('corpo-da-tabela');
        const tituloBody = document.getElementById('titulo-pagina');
        const btnAddBody = document.getElementById('botao-adicao');
        const btnPordCardapiosBody = document.getElementById('div-prod-cardapio');

        if (!tableBody) return;

        // Limpa o conteúdo atual
        cabecalhoTableBody.innerHTML = '';
        tableBody.innerHTML = '';
        tituloBody.innerHTML = '';
        btnAddBody.innerHTML = '';

        btnPordCardapiosBody.innerHTML = '<a href="#" id="btn-prod-cardapio" class="menu-item active"><span>Produtos do cardápio</span></a>';

        cabecalhoTableBody.innerHTML = '<tr><th>Nome</th><th>Preço</th><th>Data Criação</th><th>Status</th><th style="width: 240px;">Ações</th></tr>';

        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando produtos...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Produtos do Cardápio</h2>';

        btnAddBody.innerHTML = '<button id="btn-adicionar-prod-cardapio" class="add-new-btn">Adicionar Produto</button>';

        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        btnPordCardapiosBody.querySelector('.menu-item').classList.add('active');

        try {
            // Faz a requisição para a API
            const response = await apiService.prodCardapio();
            
            // Limpa a tabela novamente antes de adicionar os dados
            tableBody.innerHTML = '';

            if (!response.dados || response.dados.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum produto encontrado</td></tr>';
                return;
            }

            // Processa cada produto e adiciona à tabela
            response.dados.forEach(produto => {
                const row = document.createElement('tr');
                
                // Formata o status
                const status = produto.status === 1 ? 
                    '<span class="status-badge active">Ativo</span>' : 
                    '<span class="status-badge inactive">Inativo</span>';

                const btnStatus = produto.status === 1 ? 
                    'class="action-btn deactivate" acao="0" >Desativar' : 
                    'class="action-btn activate" acao="1">Ativar';

                // Formata a data
                const dataCriacao = new Date(produto.data_criacao).toLocaleDateString();
                
                // Formata o preço para moeda brasileira
                const precoFormatado = parseFloat(produto.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
                
                row.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${precoFormatado}</td>
                    <td>${dataCriacao}</td>
                    <td>${status}</td>
                    <td style="width: 280px;">
                        <button id="btn-editar-produto" id-produto="${produto.id}" class="action-btn edit">Editar</button>
                        <button id="btn-alterar-status-produto" id-produto="${produto.id}" ${btnStatus}</button>
                        <button id="btn-deletar-produto" id-produto="${produto.id}" class="action-btn delete">Excluir</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Erro ao carregar produtos: ${error.message}</td></tr>`;
            
            // Mostra notificação de erro
            toastr.error(error.message || 'Erro ao carregar produtos', 'Erro', {
                timeOut: 5000
            });
        }
    };
});