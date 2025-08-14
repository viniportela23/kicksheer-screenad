class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        const url = `${this.baseUrl}/${endpoint}`;
        const headers = {};
        const config = {
            method,
            headers,
            credentials: 'include'
        };

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
        // Adiciona token se existir
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }


        try {
            const response = await fetch(url, config);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro na requisição');
            }
            AuthService.setToken(responseData.token);

            return responseData;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    async login(username, password, remember) {
        return this.request('auth/login', 'POST', { username, password, remember });
    }

    async anunciantes() {
        return this.request('lista/anunciantes', 'POST');
    }

    async layoutCardapio() {
        return this.request('lista/layoutCardapio', 'POST');
    }

    async prodCardapio() {
        return this.request('lista/prodCardapio', 'POST');
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

    async addLayoutCardapio(nome, arquivo, status) {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('status', status);
        formData.append('arquivo', arquivo);

        return this.request('adiciona/layoutCardapio', 'POST', formData, true);
    }

}