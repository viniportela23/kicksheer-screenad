document.addEventListener('DOMContentLoaded', () => {
  const notificacoesBtn = document.getElementById('btn-notificacoes');
  
  // Adicionar evento de clique ao botão
  notificacoesBtn.addEventListener('click', handleNotificacoesClick);
  
  async function handleNotificacoesClick() {
    try {
      const response = await apiService.notificacoes();
      const notificacoes = response.dados;
      
      // Atualizar a badge com o número de notificações não lidas
      updateNotificationBadge(notificacoes);
      
      // Criar e exibir o dropdown de notificações
      createNotificationsDropdown(notificacoes);
      
    } catch (error) {
      console.error('Erro ao buscar dados das notificacoes:', error);
      toastr.error(error.message || 'Erro ao buscar dados das notificacoes', 'Erro', {
        timeOut: 5000
      });
    }
  }
  
  function updateNotificationBadge(notificacoes) {
    const badgeElement = document.querySelector('.notification-badge');
    const naoLidas = notificacoes.filter(notif => notif.status === 1).length;
    
    if (naoLidas > 0) {
      badgeElement.textContent = naoLidas;
      badgeElement.style.display = 'flex';
      badgeElement.classList.add('nao-lida');
      badgeElement.classList.remove('lida');
    } else {
      badgeElement.style.display = 'none';
    }
  }
  
  function createNotificationsDropdown(notificacoes) {
    // Remover dropdown existente se houver
    const existingDropdown = document.getElementById('notificacoes-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }
    
    // Criar elemento dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'notificacoes-dropdown';
    dropdown.className = 'notificacoes-dropdown';
    
    // Adicionar header
    const header = document.createElement('div');
    header.className = 'dropdown-header';
    header.innerHTML = `
      <h3>Notificações</h3>
      <span class="close-dropdown">&times;</span>
    `;
    dropdown.appendChild(header);
    
    // Adicionar lista de notificações
    const lista = document.createElement('div');
    lista.className = 'notificacoes-lista';
    
    if (notificacoes.length === 0) {
      lista.innerHTML = '<div class="notificacao-item vazia">Nenhuma notificação</div>';
    } else {
      notificacoes.forEach(notificacao => {
        const notifElement = document.createElement('div');
        notifElement.className = `notificacao-item ${notificacao.status === 1 ? 'nao-lida' : 'lida'}`;
        
        // Formatar data
        const data = new Date(notificacao.data_modificacao);
        const dataFormatada = data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        notifElement.innerHTML = `
          <div id-notificacao="${notificacao.id}" class="notificacao-content">
            <h4>${notificacao.nome}</h4>
            <p>${notificacao.descricao}</p>
            <span class="notificacao-data">${dataFormatada}</span>
          </div>
          ${notificacao.acao ? 
            `<a id="btn-ver-notificacao" id-notificacao="${notificacao.id}" acao="${notificacao.acao}" class="notificacao-acao">Ver</a>` : 
            ''}
        `;
        
        
        lista.appendChild(notifElement);
      });
    }
    
    dropdown.appendChild(lista);
    
    // Adicionar footer se houver notificações
    if (notificacoes.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'dropdown-footer';
      footer.innerHTML = '<button id="marcar-todas-lidas">Marcar todas como lidas</button>';
      dropdown.appendChild(footer);
      
    }
    
    // Adicionar evento para fechar o dropdown
    header.querySelector('.close-dropdown').addEventListener('click', () => {
      dropdown.remove();
    });
    
    // Adicionar dropdown ao documento
    document.body.appendChild(dropdown);
    
    // Posicionar dropdown abaixo do botão
    const rect = notificacoesBtn.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    
    // Fechar dropdown ao clicar fora dele
    document.addEventListener('click', closeDropdownOnClickOutside);
  }
  
  function closeDropdownOnClickOutside(event) {
    const dropdown = document.getElementById('notificacoes-dropdown');
    const notificacoesBtn = document.getElementById('btn-notificacoes');
    
    if (dropdown && 
        !dropdown.contains(event.target) && 
        !notificacoesBtn.contains(event.target)) {
      dropdown.remove();
      document.removeEventListener('click', closeDropdownOnClickOutside);
    }
  }
    
  // Carregar notificações inicialmente
  loadNotificacoes();
  
  async function loadNotificacoes() {
    try {
      const response = await apiService.notificacoes();
      const notificacoes = response.dados;
      
      // Atualizar badge
      updateNotificationBadge(notificacoes);
      
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }
});