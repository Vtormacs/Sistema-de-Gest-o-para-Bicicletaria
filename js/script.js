// ===================================================================
// FUNÇÕES DE RENDERIZAÇÃO (EXIBIÇÃO DE DADOS)
// ===================================================================

/**
 * Renderiza a tabela de produtos no dashboard (index.html).
 */
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
                        <th>Preço de Venda</th>
                    </tr>
                </thead>
            `;
            const tbody = document.createElement('tbody');
            produtos.forEach(produto => {
                const tr = document.createElement('tr');
                const precoVendaFormatado = typeof produto.precoVenda === 'number' ? produto.precoVenda.toFixed(2) : '0.00';
                tr.innerHTML = `
                    <td>${produto.descricao}</td>
                    <td>${produto.fabricante}</td>
                    <td>R$ ${precoVendaFormatado}</td>
                `;
                tbody.appendChild(tr);
            });
            tabela.appendChild(tbody);
            listaProdutosContainer.appendChild(tabela);
        }
    }
}

/**
 * Renderiza os cards de produtos na vitrine (vitrine.html).
 */
function renderizarVitrine() {
    const vitrineContainer = document.getElementById('vitrine-produtos');
    if (vitrineContainer) {
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        vitrineContainer.innerHTML = '';
        if (produtos.length === 0) {
            vitrineContainer.innerHTML = '<p>Nenhum produto para exibir na vitrine.</p>';
        } else {
            produtos.forEach(produto => {
                const card = document.createElement('div');
                card.className = 'produto-card';
                const precoVendaFormatado = typeof produto.precoVenda === 'number' ? produto.precoVenda.toFixed(2) : '0.00';
                card.innerHTML = `
                    <img src="https://via.placeholder.com/200" alt="Imagem do Produto">
                    <h3>${produto.descricao}</h3>
                    <p class="preco">R$ ${precoVendaFormatado}</p>
                    <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                `;
                vitrineContainer.appendChild(card);
            });
        }
    }
}

// ===================================================================
// EVENTO PRINCIPAL - RODA QUANDO A PÁGINA CARREGA
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO FORMULÁRIO DE CADASTRO DE PRODUTO ---
    const formCadastro = document.getElementById('form-cadastro-produto');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
            const precoVendaInput = parseFloat(document.getElementById('preco-venda').value);
            const precoCustoInput = parseFloat(document.getElementById('preco-custo').value);
            const novoProduto = {
                id: Date.now(), 
                descricao: document.getElementById('descricao').value,
                precoVenda: isNaN(precoVendaInput) ? 0 : precoVendaInput,
                precoCusto: isNaN(precoCustoInput) ? 0 : precoCustoInput,
                fabricante: document.getElementById('fabricante').value,
                categoria: document.getElementById('categoria').value,
            };
            produtos.push(novoProduto);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            alert('Produto cadastrado com sucesso!');
            formCadastro.reset();
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

    // --- CHAMADAS DE RENDERIZAÇÃO ---
    // O script tentará executar ambas as funções em todas as páginas.
    // Cada função só fará algo se encontrar o seu respectivo container na página.
    renderizarProdutos(); // Para o dashboard
    renderizarVitrine();  // Para a vitrine
     renderizarHistoricoVendas();
});

// Adicione esta nova função ao seu arquivo js/script.js

/**
 * Renderiza o histórico de vendas no dashboard.
 */
function renderizarHistoricoVendas() {
    const historicoContainer = document.getElementById('historico-vendas');
    if (historicoContainer) {
        const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
        historicoContainer.innerHTML = '';

        if (vendas.length === 0) {
            historicoContainer.innerHTML = '<p>Nenhuma venda foi realizada ainda.</p>';
        } else {
            // Ordena as vendas da mais recente para a mais antiga
            vendas.sort((a, b) => b.id - a.id).forEach(venda => {
                const cardVenda = document.createElement('div');
                cardVenda.className = 'venda-card';

                // Cria a lista de itens da venda para o HTML
                const itensHtml = venda.itens.map(item => 
                    `<li>${item.quantidade}x ${item.descricao} - R$ ${item.precoUnitario.toFixed(2)}</li>`
                ).join('');

                cardVenda.innerHTML = `
                    <h4>Venda #${venda.id} - Data: ${venda.data}</h4>
                    <p><strong>Total da Venda: R$ ${venda.total.toFixed(2)}</strong></p>
                    <ul>${itensHtml}</ul>
                `;
                historicoContainer.appendChild(cardVenda);
            });
        }
    }
}