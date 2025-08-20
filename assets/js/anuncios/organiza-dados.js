const organizaDados = (dados) => {
    
    // Verifica se não há layout válido
    if (!dados || !dados.layout || !dados.layout.dados || dados.layout.dados.length === 0) {
        // Se não tem layout, processa apenas os anunciantes válidos
        const anunciantes = dados && dados.anunciantes ? processarAnunciantes(dados.anunciantes.dados) : [];
        
        return {
            htmlCardapio: '', // Cardápio vazio
            anunciantes,
            tempoCardapio: 0, // Tempo zero para cardápio
            layout: null,
            apenasAnuncios: true // Flag indicando que só tem anúncios
        };
    }

    // Verifica se os outros dados necessários existem
    if (!dados.anunciantes || !dados.produtos) {
        throw new Error('Dados incompletos para organização');
    }

    // 1. Processar o layout do cardápio
    const layout = processarLayout(dados.layout.dados[0]);
    
    // 2. Processar produtos do cardápio
    const produtos = processarProdutos(dados.produtos.dados);
    
    // 3. Processar anunciantes válidos
    const anunciantes = processarAnunciantes(dados.anunciantes.dados);
    
    
    // 4. Montar o HTML do cardápio
    const htmlCardapio = montarCardapioHTML(layout, produtos);

    return {
        htmlCardapio,
        anunciantes,
        tempoCardapio: layout.tempo, // 20 segundos em milissegundos
        layout,
        apenasAnuncios: false
    };
};

// Função para converter HEX para RGB
const hexToRgb = (hex) => {
    // Remove o # se existir
    hex = hex.replace('#', '');
    
    // Converte para RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
};

const processarLayout = (layout) => {
    return {
        id: layout.id,
        nome: layout.nome,
        imagem: layout.imagem,
        status: layout.status,
        tempo: layout.tempo * 1000,
        cor_titulo: layout.cor_titulo ? hexToRgb(layout.cor_titulo) : '255, 255, 255', // Branco padrão
        cor_fundo: layout.cor_fundo ? hexToRgb(layout.cor_fundo) : '255, 255, 255', // Branco padrão
        cor_nome: layout.cor_nome ? hexToRgb(layout.cor_nome) : '0, 0, 0', // Preto padrão
        cor_preco: layout.cor_preco ? hexToRgb(layout.cor_preco) : '0, 0, 0' // Preto padrão
    };
};

const processarProdutos = (produtos) => {
    return produtos
        .filter(produto => produto.status === 1)
        .map(produto => ({
            id: produto.id,
            nome: produto.nome,
            preco: formatarPreco(produto.preco),
            status: produto.status
        }));
};

const processarAnunciantes = (anunciantes) => {
    const hoje = new Date();
    
    return anunciantes
        .filter(anunciante => {
            // Verifica se o status é ativo e se a data de finalização é futura
            if (anunciante.status !== 1) return false;
            
            const dataFinalizacao = new Date(anunciante.data_finalizacao);
            return dataFinalizacao > hoje;
        })
        .map(anunciante => ({
            id: anunciante.id,
            nome: anunciante.nome,
            arquivo: anunciante.arquivo,
            tempo: anunciante.tempo * 1000, // Convertendo para milissegundos
            dataFinalizacao: anunciante.data_finalizacao
        }));
};

const formatarPreco = (preco) => {
    const numero = parseFloat(preco);
    return isNaN(numero) ? 'R$ 0,00' : `R$ ${numero.toFixed(2).replace('.', ',')}`;
};

const montarCardapioHTML = (layout, produtos) => {
    // Usando as cores em RGB para o CSS
    let html = `
        <div class="cardapio-container" style="background-image: url('http://192.168.0.104/api/uploads/layouts/${layout.imagem}'); background-color: rgba(${layout.cor_fundo}, 0.9);">
            <div class="cardapio-header">
                <h1 style="color: rgb(${layout.cor_titulo});">${layout.nome}</h1>
            </div>
            <div class="produtos-lista" style="background-color: rgba(255, 255, 255, 0.8);">
    `;
    
    produtos.forEach(produto => {
        html += `
            <div class="produto-item">
                <h3 style="color: rgb(${layout.cor_nome});">${produto.nome}</h3>
                <span class="preco" style="color: rgb(${layout.cor_preco});">${produto.preco}</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
};