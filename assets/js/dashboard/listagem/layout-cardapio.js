// layoutCardapio.js
document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-layout-cardapio')) {
            e.preventDefault();
            await loadLayoutCardapio();
        }
    });

    // Função para verificar se o cookie existe
    const hasNotificationCookie = () => {
        return document.cookie.split(';').some(cookie => 
            cookie.trim().startsWith('layout_notification_shown=')
        );
    };

    // Função para criar o cookie
    const setNotificationCookie = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 10); // 10 anos a partir de agora
        document.cookie = `layout_notification_shown=true; expires=${date.toUTCString()}; path=/`;
    };

    const loadLayoutCardapio = async () => {
        // Verifica se a notificação já foi mostrada
        if (!hasNotificationCookie()) {
            // Mostra o modal de confirmação apenas se o cookie não existir
            const respostaComfirmada = await Swal.fire({
                title: 'ATENÇÃO!!',
                text: "O sistema permite apenas um cardápio ativo por vez. Ao ativar um novo, o cardápio anterior é desativado automaticamente. Se todos os cardápios estiverem desativados, o sistema irá ignorar a funcionalidade e exibir apenas anúncios na tela.",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Sim, entendo!'
            });

            // Se o usuário confirmou, cria o cookie
            if (respostaComfirmada) {
                setNotificationCookie();
            } else {
                // Se cancelou, não continua o processo
                return;
            }
        }

        // Continua com o carregamento do layout (com ou sem confirmação)
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

        cabecalhoTableBody.innerHTML = '<tr><th>Nome</th><th>Imagem</th><th>Status</th><th style="width: 240px;">Ações</th></tr>';

        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Carregando layouts...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Layouts de Cardápio</h2>';

        btnAddBody.innerHTML = '<button id="btn-adicionar-layout-cardapio" class="add-new-btn">Adicionar Layout</button>';

        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        btnLayoutCardapioBody.querySelector('.menu-item').classList.add('active');
        const url = API_BASE_URL + '/uploads/layouts/';

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
                
                const status = layout.status === 1 ? 
                    '<span class="status-badge active">Ativo</span>' : 
                    '<span class="status-badge inactive">Inativo</span>';

                const btnStatus = layout.status === 1 ? 
                    'class="action-btn deactivate" acao="0" >Desativar' : 
                    'class="action-btn activate" acao="1">Ativar';

                const imagemLink = layout.imagem ? 
                    `<img src="${url}${layout.imagem}" alt="Girl in a jacket" width="50">` : 
                    '<i class="fas fa-image" style="color: #ccc;"></i>';

                row.innerHTML = `
                    <td>${layout.nome}</td>
                    <td>${imagemLink}</td>
                    <td>${status}</td>
                    <td style="width: 280px;">
                        <button id="btn-editar-layout" id-layout="${layout.id}" class="action-btn edit">Editar</button>
                        <button id="btn-alterar-status-layout" id-layout="${layout.id}" ${btnStatus}</button>
                        <button id="btn-deletar-layout" id-layout="${layout.id}" class="action-btn delete">Excluir</button>
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