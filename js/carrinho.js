// js/carrinho.js

/**
 * Adiciona um produto ao carrinho no localStorage.
 * O carrinho armazena apenas o ID do produto e a quantidade.
 * @param {number} produtoId - O ID do produto a ser adicionado.
 */
function adicionarAoCarrinho(produtoId) {
    // Busca a lista de todos os produtos para garantir que o produto existe.
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = todosProdutos.find(p => p.id === produtoId);

    if (!produto) {
        alert('Produto não encontrado!');
        return;
    }

    // Busca o carrinho atual do localStorage.
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifica se o produto já está no carrinho.
    const itemNoCarrinho = carrinho.find(item => item.id === produtoId);

    if (itemNoCarrinho) {
        // Se já estiver, apenas incrementa a quantidade.
        itemNoCarrinho.quantidade++;
    } else {
        // Se não estiver, adiciona o novo item com quantidade 1.
        carrinho.push({ id: produtoId, quantidade: 1 });
    }

    // Salva o carrinho atualizado de volta no localStorage.
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`"${produto.descricao}" foi adicionado ao carrinho!`);
}

/**
 * Renderiza os itens do carrinho na página carrinho.html.
 */
function renderizarCarrinho() {
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    const containerItens = document.getElementById('itens-carrinho');
    const containerTotal = document.getElementById('total-carrinho');

    if (containerItens) {
        containerItens.innerHTML = ''; // Limpa a área antes de renderizar.
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

        // Renderiza o total
        containerTotal.innerHTML = `
            <h3>Total da Compra:</h3>
            <p>R$ ${totalGeral.toFixed(2)}</p>
            <button class="btn">Finalizar Compra</button>
        `;
    }
}

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
        tabela.innerHTML = `...`; // O conteúdo da tabela continua o mesmo

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

        // Renderiza o total
        containerTotal.innerHTML = `
            <h3>Total da Compra:</h3>
            <p>R$ ${totalGeral.toFixed(2)}</p>
            <button class="btn" onclick="finalizarVenda()">Finalizar Compra</button>
        `;
    }
}

/**
 * Remove um item do carrinho.
 * ... (a função removerDoCarrinho continua a mesma)
 */
function removerDoCarrinho(produtoId) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}


// --- NOVA FUNÇÃO PARA FINALIZAR A VENDA ---
/**
 * Simula a finalização da venda, registra a transação e limpa o carrinho.
 */
function finalizarVenda() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Pega o histórico de vendas ou cria um novo
    let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

    // Calcula o total e cria uma lista detalhada dos itens da venda
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

    // Cria um novo objeto de venda
    const novaVenda = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'), // Data e hora da venda
        itens: itensVenda,
        total: totalVenda
    };

    // Adiciona a nova venda ao histórico
    vendas.push(novaVenda);
    
    // Salva o histórico de vendas atualizado
    localStorage.setItem('vendas', JSON.stringify(vendas));

    // Limpa o carrinho
    localStorage.removeItem('carrinho');

    alert('Venda realizada com sucesso!');
    
    // Redireciona o usuário para o dashboard para ver o histórico
    window.location.href = 'index.html';
}


// --- LÓGICA EXECUTADA QUANDO A PÁGINA É CARREGADA ---
document.addEventListener('DOMContentLoaded', function() {
    renderizarCarrinho();
});