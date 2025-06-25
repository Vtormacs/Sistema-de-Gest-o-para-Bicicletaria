
function renderizarRelatorio(filtros = {}) {
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    const corpoTabela = document.getElementById('corpo-tabela-relatorio');
    const containerTotais = document.getElementById('totais-relatorio');

    if (!corpoTabela) return; // Sai se não estiver na página de relatório

    // 1. "Aplanar" os dados: transformar vendas com múltiplos itens em uma lista de itens vendidos.
    let itensVendidos = [];
    vendas.forEach(venda => {
        venda.itens.forEach(item => {
            itensVendidos.push({
                data: venda.data,
                descricao: item.descricao,
                vendedor: venda.vendedor,
                formaPagamento: venda.formaPagamento,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                subtotal: item.quantidade * item.precoUnitario
            });
        });
    });

    // 2. Aplicar filtros
    const itensFiltrados = itensVendidos.filter(item => {
        const filtroDescricao = filtros.descricao ? item.descricao.toLowerCase().includes(filtros.descricao.toLowerCase()) : true;
        const filtroVendedor = filtros.vendedor ? item.vendedor.toLowerCase().includes(filtros.vendedor.toLowerCase()) : true;
        return filtroDescricao && filtroVendedor;
    });

    // 3. Renderizar a tabela
    corpoTabela.innerHTML = ''; // Limpa a tabela
    let totalGeral = 0;
    let totalItens = 0;

    itensFiltrados.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.data}</td>
            <td>${item.descricao}</td>
            <td>${item.vendedor}</td>
            <td>${item.formaPagamento}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.precoUnitario.toFixed(2)}</td>
            <td>R$ ${item.subtotal.toFixed(2)}</td>
        `;
        corpoTabela.appendChild(tr);
        totalGeral += item.subtotal;
        totalItens += item.quantidade;
    });

    // 4. Renderizar os totais
    if (containerTotais) {
        containerTotais.innerHTML = `
            <h3>Resumo do Relatório</h3>
            <p><strong>Total de Itens Vendidos:</strong> ${totalItens}</p>
            <p><strong>Valor Total das Vendas:</strong> R$ ${totalGeral.toFixed(2)}</p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Renderização inicial
    renderizarRelatorio();

    // Listeners para os filtros
    const filtroDescricaoInput = document.getElementById('filtro-descricao');
    const filtroVendedorInput = document.getElementById('filtro-vendedor');

    function aplicarFiltros() {
        const filtros = {
            descricao: filtroDescricaoInput.value,
            vendedor: filtroVendedorInput.value
        };
        renderizarRelatorio(filtros);
    }

    if (filtroDescricaoInput) filtroDescricaoInput.addEventListener('keyup', aplicarFiltros);
    if (filtroVendedorInput) filtroVendedorInput.addEventListener('keyup', aplicarFiltros);
});