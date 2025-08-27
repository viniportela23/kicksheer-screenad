class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        let url = `${this.baseUrl}/${endpoint}`;
        const headers = {};
        const config = {
            method,
            headers,
            credentials: 'include'
        };

        // Para métodos GET, adiciona parâmetros na URL
        if (method === 'GET' && data) {
            const params = new URLSearchParams();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    params.append(key, data[key]);
                }
            });
            url += `?${params.toString()}`;
        } 
        // Para outros métodos, trata o corpo normalmente
        else if (method !== 'GET') {
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
                if (data) {
                    config.body = JSON.stringify(data);
                }
            } else {
                if (data) {
                    config.body = data;
                }
            }
        }

        // Adiciona token se existir
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            headers['Token-Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro na requisição');
            }
            
            // Só atualiza o token se vier na resposta
            if (responseData.token) {
                AuthService.setToken(responseData.token);
            }

            return responseData;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    async login(username, password, remember) {
        return this.request('auth/login', 'POST', { username, password, remember });
    }

    async usuario() {
        return this.request('lista/usuario', 'GET');
    }

    async notificacoes() {
        return this.request('lista/notificacoes', 'GET');
    }

    async anunciantes(id = null, status = null) {
        return this.request('lista/anunciantes', 'GET', { id ,status });
    }

    async layoutCardapio(id = null, status = null) {
        return this.request('lista/layoutCardapio', 'GET', { id ,status });
    }

    async prodCardapio(id = null, status = null) {
        return this.request('lista/prodCardapio', 'GET', { id ,status });
    }

    async addAnunciantes(nome, arquivo, tempo, data_finalizacao, status) {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('tempo', tempo);
        formData.append('data_finalizacao', data_finalizacao);
        formData.append('status', status);
        formData.append('arquivo', arquivo);

        return this.request('adiciona/anunciantes', 'POST', formData, true);
    }

    async addProdCardapio(nome, preco, status) {
        return this.request('adiciona/prodCardapio', 'POST', { nome, preco, status });
    }

    async addLayoutCardapio(nome, arquivo, status, tempo, corTitulo, corFundo, corNome, corPreco) {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('status', status);
        formData.append('tempo', tempo);
        formData.append('corTitulo', corTitulo);
        formData.append('corFundo', corFundo);
        formData.append('corNome', corNome);
        formData.append('corPreco', corPreco);
        formData.append('arquivo', arquivo);

        return this.request('adiciona/layoutCardapio', 'POST', formData, true);
    }

    async editAnunciantes(id, status, nome = null, tempo = null, data_finalizacao = null, arquivo = null) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('nome', nome);
        formData.append('tempo', tempo);
        formData.append('data_finalizacao', data_finalizacao);
        formData.append('status', status);
        formData.append('arquivo', arquivo);

        return this.request('update/anunciantes', 'POST', formData, true);
    }

    async editProdCardapio(id, status, nome = null, preco = null) {
        return this.request('update/prodCardapio', 'PUT', { id, nome, preco, status });
    }

    async editNotificacoes(id, status) {
        return this.request('update/notificacoes', 'PUT', { id, status });
    }

    async editLayoutCardapio(id, status, nome = null, arquivo = null, tempo = null, corTitulo = null, corFundo = null, corNome = null, corPreco = null) {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('nome', nome);
        formData.append('status', status);
        formData.append('tempo', tempo);
        formData.append('corTitulo', corTitulo);
        formData.append('corFundo', corFundo);
        formData.append('corNome', corNome);
        formData.append('corPreco', corPreco);

        formData.append('arquivo', arquivo);

        return this.request('update/layoutCardapio', 'POST', formData, true);
    }

    async deletAnunciantes(id) {
        return this.request('deletar/anunciantes', 'DELETE', { id });
    }
    
    async deletProdCardapio(id) {
        return this.request('deletar/prodCardapio', 'DELETE', { id });
    }  

    async deletLayoutCardapio(id) {
        return this.request('deletar/layoutCardapio', 'DELETE', { id });
    }

}