
document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('form-cadastro-produto');


    if (form) {
        form.addEventListener('submit', function(event) {

            event.preventDefault(); 

            const dadosProduto = {
                descricao: document.getElementById('descricao').value,
                precoVenda: document.getElementById('preco-venda').value,
                precoCusto: document.getElementById('preco-custo').value,
                fabricante: document.getElementById('fabricante').value,
                categoria: document.getElementById('categoria').value,

            };

            console.log('Dados do Produto a serem cadastrados:', dadosProduto);

            alert('Produto cadastrado com sucesso! (Verifique o console para ver os dados)');
 
            form.reset();
        });
    }

});

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-btn');

    if(logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o comportamento padrão do link

            // Remove o "crachá" do sessionStorage
            sessionStorage.removeItem('usuarioLogado');

            // Redireciona para a página de login
            alert('Você saiu do sistema.');
            window.location.href = 'login.html';
        });
    }
});