const usuarioLogado = sessionStorage.getItem('usuarioLogado');

if (!usuarioLogado || usuarioLogado !== 'true') {
    alert('Acesso negado. Por favor, faça o login primeiro.');
    window.location.href = 'login.html';
}