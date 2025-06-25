document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const adminUser = 'admin@email.com';
            const adminPass = 'admin123';

            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('senha').value;

            if (emailDigitado === adminUser && senhaDigitada === adminPass) {
                sessionStorage.setItem('usuarioLogado', 'true');

                alert('Login realizado com sucesso!');
                window.location.href = 'index.html'; 
            } else {
                alert('Usuário ou senha inválidos. Tente novamente.');
            }
        });
    }
});