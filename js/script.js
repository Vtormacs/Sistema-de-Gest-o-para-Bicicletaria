// --- FUNÇÃO PARA RENDERIZAR PRODUTOS NA TELA ---
function renderizarProdutos() {
    const listaProdutosContainer = document.getElementById('lista-produtos');
    
    if (listaProdutosContainer) {
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        listaProdutosContainer.innerHTML = ''; 

        if (produtos.length === 0) {
            listaProdutosContainer.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
        } else {
            const tabela = document.createElement('table');
            tabela.className = 'tabela-produtos';
            tabela.innerHTML = `
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Fabricante</th>
                        <th>Categoria</th>
                        <th>Preço de Venda</th>
                    </tr>
                </thead>
            `;
            const tbody = document.createElement('tbody');
            produtos.forEach(produto => {
                const tr = document.createElement('tr');
                
                // Garantimos que precoVenda é um número antes de formatar
                const precoVendaFormatado = typeof produto.precoVenda === 'number' ? produto.precoVenda.toFixed(2) : '0.00';

                tr.innerHTML = `
                    <td>${produto.descricao}</td>
                    <td>${produto.fabricante}</td>
                    <td>${produto.categoria}</td>
                    <td>R$ ${precoVendaFormatado}</td> 
                `;
                tbody.appendChild(tr);
            });
            tabela.appendChild(tbody);
            listaProdutosContainer.appendChild(tabela);
        }
    }
}


// --- EVENTO PRINCIPAL QUE RODA QUANDO O HTML É CARREGADO ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO FORMULÁRIO DE CADASTRO DE PRODUTO ---
    const formCadastro = document.getElementById('form-cadastro-produto');

    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

            // --- CORREÇÃO APLICADA AQUI ---
            // 1. Pegamos os valores e convertemos para número
            const precoVendaInput = parseFloat(document.getElementById('preco-venda').value);
            const precoCustoInput = parseFloat(document.getElementById('preco-custo').value);

            // 2. Criamos o objeto de produto
            const novoProduto = {
                id: Date.now(), 
                descricao: document.getElementById('descricao').value,
                // 3. Verificamos se o resultado é NaN. Se for, usamos 0.
                precoVenda: isNaN(precoVendaInput) ? 0 : precoVendaInput,
                precoCusto: isNaN(precoCustoInput) ? 0 : precoCustoInput,
                fabricante: document.getElementById('fabricante').value,
                categoria: document.getElementById('categoria').value,
            };
            
            produtos.push(novoProduto);
            localStorage.setItem('produtos', JSON.stringify(produtos));

            alert('Produto cadastrado com sucesso!');
            formCadastro.reset();

            // Opcional: Se a lista de produtos estiver na mesma página do formulário,
            // podemos re-renderizar a lista imediatamente.
            // renderizarProdutos(); 
        });
    }

    // --- LÓGICA DO BOTÃO DE LOGOUT ---
    const logoutButton = document.getElementById('logout-btn');

    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            sessionStorage.removeItem('usuarioLogado');
            alert('Você saiu do sistema.');
            window.location.href = 'login.html';
        });
    }

    // --- CHAMADA INICIAL PARA RENDERIZAR OS PRODUTOS ---
    renderizarProdutos();
});