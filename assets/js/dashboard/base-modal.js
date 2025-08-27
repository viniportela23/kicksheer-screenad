class BaseModal {
  constructor() {
    this.modal = null;
    this.modalContent = null;
    this.closeButton = null;
  }

  createModal(title) {
    // Cria a estrutura básica do modal
    this.modal = document.createElement('div');
    this.modal.className = 'base-modal';
    this.modal.style.display = 'none';

    // Cria o conteúdo do modal
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;

    this.closeButton = document.createElement('button');
    this.closeButton.className = 'close-modal';
    this.closeButton.innerHTML = '&times;';

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(this.closeButton);

    this.modalContent = document.createElement('div');
    this.modalContent.className = 'modal-content';

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    this.modal.appendChild(modalHeader);
    this.modal.appendChild(this.modalContent);
    this.modal.appendChild(modalFooter);

    document.body.appendChild(this.modal);

    // Adiciona evento para fechar o modal
    this.closeButton.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    return {
      modal: this.modal,
      content: this.modalContent,
      footer: modalFooter
    };
  }

  openModal() {
    this.modal.style.display = 'grid';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }
}

function modalDashboard(options) {
  const baseModal = new BaseModal();
  const { modal, content, footer } = baseModal.createModal(options.title || 'Modal');

  // Adiciona conteúdo personalizado se fornecido
  if (options.content) {
    content.innerHTML = options.content;
  }

  // Adiciona botões personalizados se fornecidos
  if (options.buttons) {
    options.buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.textContent = button.text;
      btn.className = button.class || '';
      btn.addEventListener('click', button.handler);
      footer.appendChild(btn);
    });
  }

  return {
    open: () => baseModal.openModal(),
    close: () => baseModal.closeModal(),
    getContent: () => content,
    getFooter: () => footer
  };
}