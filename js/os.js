// js/os.js

/**
 * Função principal que renderiza a lista de Ordens de Serviço na tela.
 */
function renderizarListaOS() {
    const listaOSContainer = document.getElementById('lista-os');
    if (!listaOSContainer) return;

    const ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    listaOSContainer.innerHTML = '';

    if (ordens.length === 0) {
        listaOSContainer.innerHTML = '<p>Nenhuma Ordem de Serviço registrada.</p>';
        return;
    }

    ordens.sort((a, b) => b.id - a.id).forEach(os => { // Adicionado .sort() para mostrar as mais recentes primeiro
        const osCard = document.createElement('div');
        osCard.className = 'os-card';
        osCard.innerHTML = `
            <div class="os-header">
                <h4>O.S. #${os.id} - ${os.cliente.nome}</h4>
                <p>Status: <span class="status ${os.status.toLowerCase().replace(' ', '-')}">${os.status}</span></p>
            </div>
            <div class="os-body">
                <p><strong>Bicicleta:</strong> ${os.bicicleta}</p>
                <p><strong>Problema:</strong> ${os.problema}</p>
            </div>
            <div class="os-footer">
                <button class="btn" onclick="abrirModalDetalhes(${os.id})">Ver/Editar Detalhes</button>
                ${os.status === 'Finalizado' ? `<button class="btn" onclick="cobrarOS(${os.id})">Gerar Venda</button>` : ''}
            </div>
        `;
        listaOSContainer.appendChild(osCard);
    });
}

/**
 * Abre o modal com os detalhes de uma O.S. específica.
 * @param {number} osId - O ID da O.S. a ser exibida.
 */
function abrirModalDetalhes(osId) {
    const ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    const os = ordens.find(o => o.id === osId);
    if (!os) return;

    const todosProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    const conteudoModal = document.getElementById('conteudo-modal-os');
    
    // --- CORREÇÃO APLICADA AQUI ---
    // Adicionamos a verificação para garantir que o preço é um número antes de usar .toFixed()
    const optionsHtml = todosProdutos.map(p => {
        const precoFormatado = typeof p.precoVenda === 'number' ? p.precoVenda.toFixed(2) : '0.00';
        return `<option value="${p.id}">${p.descricao} - R$ ${precoFormatado}</option>`;
    }).join('');

    const itensHtml = os.itens.map(item => {
        const produtoInfo = todosProdutos.find(p => p.id === item.id);
        return `<li>${produtoInfo.descricao} (Qtd: ${item.quantidade}) <span class="remover-item" onclick="removerItemDaOS(${os.id}, ${item.id})">&times;</span></li>`;
    }).join('');

    conteudoModal.innerHTML = `
        <h2>Detalhes da O.S. #${os.id}</h2>
        <p><strong>Cliente:</strong> ${os.cliente.nome} | <strong>Telefone:</strong> ${os.cliente.telefone}</p>
        <p><strong>Status:</strong> 
            <select onchange="alterarStatusOS(${os.id}, this.value)">
                <option value="Aberto" ${os.status === 'Aberto' ? 'selected' : ''}>Aberto</option>
                <option value="Em Andamento" ${os.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                <option value="Finalizado" ${os.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                 <option value="Faturado" ${os.status === 'Faturado' ? 'selected' : ''}>Faturado</option>
            </select>
        </p>
        <hr>
        <h3>Itens da O.S. (Peças e Serviços)</h3>
        <ul>${itensHtml || 'Nenhum item adicionado.'}</ul>
        <div class="add-item-container">
            <select id="select-item-os">${optionsHtml}</select>
            <button class="btn" onclick="adicionarItemNaOS(${os.id})">Adicionar Item</button>
        </div>
    `;

    document.getElementById('modal-os-detalhes').style.display = 'block';
}

function fecharModalDetalhes() {
    document.getElementById('modal-os-detalhes').style.display = 'none';
}


function adicionarItemNaOS(osId) {
    const select = document.getElementById('select-item-os');
    const produtoId = parseInt(select.value);
    
    let ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    const osIndex = ordens.findIndex(o => o.id === osId);
    if (osIndex === -1) return;

    const itemExistente = ordens[osIndex].itens.find(item => item.id === produtoId);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        ordens[osIndex].itens.push({ id: produtoId, quantidade: 1 });
    }

    localStorage.setItem('ordensDeServico', JSON.stringify(ordens));
    abrirModalDetalhes(osId);
}


function removerItemDaOS(osId, produtoId) {
    let ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    const osIndex = ordens.findIndex(o => o.id === osId);
    if (osIndex === -1) return;

    ordens[osIndex].itens = ordens[osIndex].itens.filter(item => item.id !== produtoId);
    localStorage.setItem('ordensDeServico', JSON.stringify(ordens));
    abrirModalDetalhes(osId);
}


function alterarStatusOS(osId, novoStatus) {
    let ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    const osIndex = ordens.findIndex(o => o.id === osId);
    if (osIndex !== -1) {
        ordens[osIndex].status = novoStatus;
        localStorage.setItem('ordensDeServico', JSON.stringify(ordens));
        renderizarListaOS();
    }
}


function cobrarOS(osId) {
    const ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
    const os = ordens.find(o => o.id === osId);
    if (!os || os.itens.length === 0) {
        alert('Esta O.S. não tem itens para cobrar!');
        return;
    }
    localStorage.removeItem('carrinho');
    os.itens.forEach(item => {
        for (let i = 0; i < item.quantidade; i++) {
            adicionarAoCarrinho(item.id);
        }
    });
    alterarStatusOS(osId, 'Faturado');
    alert('Itens da O.S. enviados para o carrinho! Finalize a venda agora.');
    window.location.href = 'carrinho.html';
}


document.addEventListener('DOMContentLoaded', function() {
    const formOS = document.getElementById('form-nova-os');
    if (formOS) {
        formOS.addEventListener('submit', function(event) {
            event.preventDefault();
            let ordens = JSON.parse(localStorage.getItem('ordensDeServico')) || [];
            const novaOS = {
                id: Date.now(),
                cliente: {
                    nome: document.getElementById('cliente-nome').value,
                    telefone: document.getElementById('cliente-telefone').value
                },
                bicicleta: document.getElementById('bike-info').value,
                problema: document.getElementById('problema-relatado').value,
                dataEntrada: new Date().toLocaleString('pt-BR'),
                status: 'Aberto',
                itens: []
            };
            ordens.push(novaOS);
            localStorage.setItem('ordensDeServico', JSON.stringify(ordens));
            alert(`Ordem de Serviço #${novaOS.id} criada com sucesso!`);
            formOS.reset();
            renderizarListaOS();
        });
    }
    renderizarListaOS();
});