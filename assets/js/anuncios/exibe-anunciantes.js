class ExibidorAnuncios {
    constructor(dadosOrganizados) {
        this.dados = dadosOrganizados;
        this.anuncioAtualIndex = 0;
        this.timer = null;
        this.emExibicao = false;
        this.videoElement = null;
        
        this.inicializar();
    }
    
    inicializar() {
        this.exibirCardapio();
    }
    
    exibirCardapio() {
        if (this.emExibicao) return;
        
        this.emExibicao = true;
        
        // Limpa qualquer timer existente
        if (this.timer) {
            clearTimeout(this.timer);
        }
        
        // Exibe o cardápio
        this.mostrarConteudo(this.dados.htmlCardapio, 'cardapio');
                
        // Agenda a exibição do próximo anúncio
        this.timer = setTimeout(() => {
            this.emExibicao = false;
            this.exibirProximoAnuncio();
        }, this.dados.tempoCardapio);
    }
    
    exibirProximoAnuncio() {
        if (this.dados.anunciantes.length === 0) {
            console.log('Nenhum anúncio disponível, voltando para cardápio');
            this.exibirCardapio();
            return;
        }
        
        // Pega o próximo anúncio
        const anuncio = this.dados.anunciantes[this.anuncioAtualIndex];
        
        // Monta o HTML do anúncio
        const htmlAnuncio = this.montarHTMLAnuncio(anuncio);
        
        // Exibe o anúncio
        this.mostrarConteudo(htmlAnuncio, 'anuncio');
                
        // Verifica se é um vídeo para usar a duração real
        const extensao = anuncio.arquivo.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extensao);
        
        if (isVideo) {
            // Aguarda o carregamento dos metadados do vídeo para pegar a duração
            this.aguardarDuracaoVideo(anuncio);
        } else {
            // Para imagens e outros, usa o tempo configurado
            this.agendarProximo(anuncio.tempo);
        }
    }
    
    aguardarDuracaoVideo(anuncio) {
        // Aguarda o elemento de vídeo estar disponível
        const checkVideo = () => {
            this.videoElement = document.querySelector('#video-anuncio');
            
            if (this.videoElement) {
                if (this.videoElement.readyState > 0) {
                    // Vídeo já carregou metadados
                    this.usarDuracaoVideo(anuncio);
                } else {
                    // Aguarda carregamento dos metadados
                    this.videoElement.onloadedmetadata = () => {
                        this.usarDuracaoVideo(anuncio);
                    };
                    
                    // Fallback caso o evento não dispare
                    setTimeout(() => {
                        if (!this.videoElement.duration) {
                            console.warn('Falha ao carregar metadados do vídeo, usando tempo padrão');
                            this.agendarProximo(anuncio.tempo);
                        }
                    }, 3000);
                }
            } else {
                // Tenta novamente em breve
                setTimeout(checkVideo, 100);
            }
        };
        
        checkVideo();
    }
    
    usarDuracaoVideo(anuncio) {
        const duracao = this.videoElement.duration;
        
        // Converte para milissegundos e adiciona um pequeno buffer
        const tempoExibicao = (duracao * 1000) + 500;
        
        // Agenda próxima ação baseada na duração real do vídeo
        this.agendarProximo(tempoExibicao);
    }
    
    agendarProximo(tempo) {
        
        // Agenda a próxima ação
        this.timer = setTimeout(() => {
            // Avança para o próximo anúncio
            this.anuncioAtualIndex++;
            
            // Se chegou ao final da lista, volta para o cardápio
            if (this.anuncioAtualIndex >= this.dados.anunciantes.length) {
                this.anuncioAtualIndex = 0; // Reinicia o índice
                this.exibirCardapio();
            } else {
                // Próximo anúncio
                this.exibirProximoAnuncio();
            }
        }, tempo);
    }
    
    montarHTMLAnuncio(anuncio) {
        // Verifica o tipo de arquivo para exibição adequada
        const extensao = anuncio.arquivo.split('.').pop().toLowerCase();
        const isImagem = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extensao);
        const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extensao);
        const url = API_BASE_URL + '/uploads/anunciantes/';

        let conteudo = '';
        
        if (isImagem) {
            conteudo = `
                <div class="anuncio-imagem">
                    <img src="${url}${anuncio.arquivo}" 
                         alt="${anuncio.nome}" 
                         style="width: 100%; height: 100%; object-fit: contain;">
                </div>
            `;
        } else if (isVideo) {
            conteudo = `
                <div class="anuncio-video" style="width: 100%; height: 100%;">
                    <video id="video-anuncio" autoplay muted playsinline 
                           style="width: 100%; height: 100%; object-fit: contain;">
                        <source src="${url}${anuncio.arquivo}" 
                                type="video/${extensao === 'mov' ? 'quicktime' : extensao}">
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                </div>
            `;
        } else {
            // Para outros tipos de arquivo, exibe apenas o nome
            conteudo = `
                <div class="anuncio-texto" style="color: white; text-align: center;">
                    <h2>${anuncio.nome}</h2>
                    <p>Arquivo: ${anuncio.arquivo}</p>
                </div>
            `;
        }
        
        return `
            <div class="anuncio-container">
                ${conteudo}
                <div class="anuncio-info">
                    <h3>${anuncio.nome}</h3>
                </div>
            </div>
        `;
    }
    
    mostrarConteudo(html, tipo) {
        const container = document.getElementById('conteudo-container');
        if (!container) {
            console.error('Container #conteudo-container não encontrado');
            return;
        }
        
        container.innerHTML = html;
        document.body.className = tipo;
        
        // Dispara evento personalizado para notificar mudança de conteúdo
        const evento = new CustomEvent('conteudoAlterado', { 
            detail: { tipo, timestamp: Date.now() } 
        });
        document.dispatchEvent(evento);
    }
    
    parar() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.emExibicao = false;
        this.videoElement = null;
    }
    
    reiniciar() {
        this.parar();
        this.anuncioAtualIndex = 0;
        this.exibirCardapio();
    }
}

// Variável global para acesso ao exibidor
let exibidorAnuncios = null;

const iniciarExibicaoAnuncios = (dadosOrganizados) => {
    
    // Para qualquer exibição anterior
    if (exibidorAnuncios) {
        exibidorAnuncios.parar();
    }
    
    // Cria novo exibidor
    exibidorAnuncios = new ExibidorAnuncios(dadosOrganizados);
    
    return exibidorAnuncios;
};

const pararExibicaoAnuncios = () => {
    if (exibidorAnuncios) {
        exibidorAnuncios.parar();
    }
};

const reiniciarExibicaoAnuncios = () => {
    if (exibidorAnuncios) {
        exibidorAnuncios.reiniciar();
    }
};