class AuthService {
    static TOKEN_KEY = 'authToken';

    static getToken() {
        // Busca direto do cookie sem método auxiliar
        const nameEQ = `${this.TOKEN_KEY}=`;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') cookie = cookie.substring(1);
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

    static setToken(token) {
        // Define o cookie com 1 hora de expiração (código direto)
        const date = new Date();
        date.setTime(date.getTime() + (1 * 60 * 60 * 1000)); // 1 hora em milissegundos
        document.cookie = `${this.TOKEN_KEY}=${token};expires=${date.toUTCString()};path=/;SameSite=Lax${location.protocol === 'https:' ? ';Secure' : ''}`;
    }
}