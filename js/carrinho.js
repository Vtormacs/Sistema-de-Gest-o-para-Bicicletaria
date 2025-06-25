// js/carrinho.js

/**
 * Adiciona um produto ao carrinho no localStorage.
 * @param {number} produtoId - O ID do produto a ser adicionado.
 */
function adicionarAoCarrinho(produtoId) {
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = todosProdutos.find(p => p.id === produtoId);

    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemNoCarrinho = carrinho.find(item => item.id === produtoId);

    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade++;
    } else {
        carrinho.push({ id: produtoId, quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`"${produto.descricao}" foi adicionado ao carrinho!`);
}

/**
 * Renderiza os itens do carrinho e o total na página.
 */
function renderizarCarrinho() {
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    const containerItens = document.getElementById('itens-carrinho');
    const containerTotal = document.getElementById('total-carrinho');

    if (containerItens) {
        containerItens.innerHTML = '';
        let totalGeral = 0;

        if (carrinho.length === 0) {
            containerItens.innerHTML = '<p>Seu carrinho está vazio.</p>';
            containerTotal.innerHTML = '';
            return;
        }

        const tabela = document.createElement('table');
        tabela.className = 'tabela-carrinho';
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Preço Unit.</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>
                    <th>Ação</th>
                </tr>
            </thead>
        `;

        const tbody = document.createElement('tbody');
        carrinho.forEach(item => {
            const produtoInfo = todosProdutos.find(p => p.id === item.id);
            if (produtoInfo) {
                const subtotal = produtoInfo.precoVenda * item.quantidade;
                totalGeral += subtotal;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${produtoInfo.descricao}</td>
                    <td>R$ ${produtoInfo.precoVenda.toFixed(2)}</td>
                    <td>${item.quantidade}</td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                    <td><button class="btn-remover" onclick="removerDoCarrinho(${item.id})">Remover</button></td>
                `;
                tbody.appendChild(tr);
            }
        });

        tabela.appendChild(tbody);
        containerItens.appendChild(tabela);

        containerTotal.innerHTML = `
            <h3>Total da Compra:</h3>
            <p>R$ ${totalGeral.toFixed(2)}</p>
            <button class="btn" onclick="abrirModalVenda()">Finalizar Compra</button>
        `;
    }
}

/**
 * Remove um item do carrinho e atualiza a visualização.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerDoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}

/**
 * Abre o modal de finalização de venda.
 */
function abrirModalVenda() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    document.getElementById('modal-venda').style.display = 'block';
}

/**
 * Fecha o modal de finalização de venda.
 */
function fecharModalVenda() {
    document.getElementById('modal-venda').style.display = 'none';
}

/**
 * Finaliza a venda, registra no histórico e limpa o carrinho.
 * @param {string} vendedor - O nome do vendedor.
 * @param {string} formaPagamento - A forma de pagamento escolhida.
 */
function finalizarVenda(vendedor, formaPagamento) {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    let vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    let totalVenda = 0;

    const itensVenda = carrinho.map(item => {
        const produtoInfo = todosProdutos.find(p => p.id === item.id);
        totalVenda += produtoInfo.precoVenda * item.quantidade;
        return {
            id: item.id,
            descricao: produtoInfo.descricao,
            quantidade: item.quantidade,
            precoUnitario: produtoInfo.precoVenda
        };
    });

    const novaVenda = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        vendedor: vendedor,
        formaPagamento: formaPagamento,
        itens: itensVenda,
        total: totalVenda
    };

    vendas.push(novaVenda);
    localStorage.setItem('vendas', JSON.stringify(vendas));
    localStorage.removeItem('carrinho');

    alert('Venda realizada com sucesso!');
    window.location.href = 'index.html';
}

// --- LÓGICA EXECUTADA QUANDO A PÁGINA É CARREGADA ---
document.addEventListener('DOMContentLoaded', function() {
    // Renderiza o conteúdo do carrinho ao carregar a página
    renderizarCarrinho();

    // Adiciona o listener para o formulário DENTRO do modal
    const formDetalhes = document.getElementById('form-detalhes-venda');
    if (formDetalhes) {
        formDetalhes.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o recarregamento da página
            const vendedor = document.getElementById('vendedor').value;
            const formaPagamento = document.getElementById('forma-pagamento').value;
            finalizarVenda(vendedor, formaPagamento);
        });
    }
});