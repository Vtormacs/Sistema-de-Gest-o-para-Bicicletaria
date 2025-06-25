
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