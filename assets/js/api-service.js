class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json'
        };

        // Adiciona token se existir
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
            credentials: 'include'
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro na requisição');
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
}