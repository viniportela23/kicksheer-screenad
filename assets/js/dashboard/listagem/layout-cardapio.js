// layoutCardapio.js
document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-layout-cardapio')) {
            e.preventDefault();
            await loadLayoutCardapio();
        }
    });

    const loadLayoutCardapio = async () => {
        const cabecalhoTableBody = document.getElementById('cabecalho-da-tabela');
        const tableBody = document.getElementById('corpo-da-tabela');
        const tituloBody = document.getElementById('titulo-pagina');
        const btnAddBody = document.getElementById('botao-adicao');
        const btnLayoutCardapioBody = document.getElementById('div-layout-cardapio');

        if (!tableBody) return;

        // Limpa o conteúdo atual
        cabecalhoTableBody.innerHTML = '';
        tableBody.innerHTML = '';
        tituloBody.innerHTML = '';
        btnAddBody.innerHTML = '';

        btnLayoutCardapioBody.innerHTML = '<a href="#" id="btn-layout-cardapio" class="menu-item active"><span>Layout de cardápios</span></a>';

        cabecalhoTableBody.innerHTML = '<tr><th>Nome</th><th>Imagem</th><th>Ações</th></tr>';

        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Carregando layouts...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Layouts de Cardápio</h2>';

        btnAddBody.innerHTML = '<button id="btn-adicionar-layout-cardapio" class="add-new-btn">Adicionar Layout</button>';

        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        btnLayoutCardapioBody.querySelector('.menu-item').classList.add('active');

        try {
            // Faz a requisição para a API
            const response = await apiService.layoutCardapio();
            
            // Limpa a tabela novamente antes de adicionar os dados
            tableBody.innerHTML = '';

            if (!response.dados || response.dados.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum layout encontrado</td></tr>';
                return;
            }

            // Processa cada layout e adiciona à tabela
            response.dados.forEach(layout => {
                const row = document.createElement('tr');
                
                // Cria o link para a imagem
                const imagemLink = layout.imagem ? 
                    `<img src="http://192.168.0.104/api/uploads/layouts/${layout.imagem}" alt="Girl in a jacket" width="50">` : 
                    '<i class="fas fa-image" style="color: #ccc;"></i>';
                
                row.innerHTML = `
                    <td>${layout.nome}</td>
                    <td>${imagemLink}</td>
                    <td>
                        <button class="action-btn edit">Editar</button>
                        <button class="action-btn delete">Excluir</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Erro ao carregar layouts:', error);
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Erro ao carregar layouts: ${error.message}</td></tr>`;
            
            // Mostra notificação de erro
            toastr.error(error.message || 'Erro ao carregar layouts', 'Erro', {
                timeOut: 5000
            });
        }
    };
});