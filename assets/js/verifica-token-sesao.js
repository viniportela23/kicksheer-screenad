function checkAuth() {
  const localStorageToken = localStorage.getItem('authToken');
  if (localStorageToken) {
    return true;
  }

  const cookieToken = getCookie('authToken');
  if (cookieToken) {
    return true;
  }

  return false;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

document.addEventListener('DOMContentLoaded', () => {
  const isAuthenticated = checkAuth();
  if (!isAuthenticated) {
    console.warn('Usuário não autenticado. Redirecionando para login...');
    window.location.href = 'index.html'; // ou '/login.html', dependendo da sua estrutura
  }
});