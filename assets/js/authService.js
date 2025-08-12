class AuthService {
    static TOKEN_KEY = 'authToken';
    static REMEMBER_ME_KEY = 'rememberMe';

    static getToken() {
        // Verifica primeiro nos cookies
        const cookieToken = this.getCookie(this.TOKEN_KEY);
        if (cookieToken) return cookieToken;
        
        // Fallback para localStorage/sessionStorage
        return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token, remember = false) {
        // Define o cookie
        this.setCookie(this.TOKEN_KEY, token, remember ? 30 : 1);

        // Armazena também no storage
        if (remember) {
            localStorage.setItem(this.TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    static setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax${location.protocol === 'https:' ? ';Secure' : ''}`;
    }

    static getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }
}