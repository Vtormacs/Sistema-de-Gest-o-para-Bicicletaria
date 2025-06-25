document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {

            event.preventDefault();

            // --- DADOS DO ADMIN REGISTRADOS NO CÓDIGO ---
            // Em uma aplicação real, isso viria de um banco de dados!
            const adminUser = 'admin@email.com';
            const adminPass = 'admin123';
            // ---------------------------------------------

            const emailDigitado = document.getElementById('email').value;
            const senhaDigitada = document.getElementById('senha').value;

            if (emailDigitado === adminUser && senhaDigitada === adminPass) {
                alert('Login realizado com sucesso!');
                window.location.href = 'index.html';
            } else {
                alert('Usuário ou senha inválidos. Tente novamente.');
            }
        });
    }
});