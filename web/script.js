const url = 'http://localhost:3000';
const rotaDiscos = '/disco';
const rotaMovimentacoes = '/movimentacao';

const discos = [];
const listaMovimentacoes = [];

let discoAtual;
let movimentacaoAtual;

const tabelaDiscos = document.getElementById('tabela-discos');
const campoBusca = document.getElementById('input-busca');
const idDisco = document.getElementById('disco-id');
const tituloDisco = document.getElementById('disco-titulo');
const artistaDisco = document.getElementById('disco-artista');
const generoDisco = document.getElementById('disco-genero');
const custoDisco = document.getElementById('disco-custo');
const precoDisco = document.getElementById('disco-preco');
const quantidadeDisco = document.getElementById('disco-quantidade');
const estoqueMinimoDisco = document.getElementById('disco-estoque-minimo');

const tabelaMovimentacoes = document.getElementById('tabela-movimentacoes');
const idMovimentacao = document.getElementById('movimentacao-id');
const tipoMovimentacao = document.getElementById('select-tipo');
const quantidadeMovimentacao = document.getElementById('input-quantidade');
const dataMovimentacao = document.getElementById('input-data');


async function chamarApi(caminho, metodo = 'GET', dados) {
    const opcoes = { method: metodo };

    if (dados) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(dados);
    }

    const resposta = await fetch(url + caminho, opcoes);
    const resultado = resposta.status === 204 ? {} : await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || 'Erro na API');
    return await resultado;
}

function mostrarErro() {
    alert('Problemas com a conexão da API');
}

function adicionarLinha(tabela, valores, aoEditar, aoExcluir) {
    const linha = tabela.insertRow();
    valores.forEach(valor => {
        linha.insertCell().textContent = valor === undefined ? '' : valor;
    });

    const acoes = linha.insertCell();
    const editar = document.createElement('button');
    editar.textContent = 'Editar';
    editar.className = 'btn-primary';
    editar.onclick = aoEditar;
    acoes.appendChild(editar);

    const excluir = document.createElement('button');
    excluir.textContent = 'Excluir';
    excluir.className = 'btn-danger';
    excluir.onclick = aoExcluir;
    acoes.appendChild(excluir);
}

function carregarDiscos() {
    chamarApi(rotaDiscos + '/listar')
        .then(resultado => {
            discos.length = 0;
            discos.push(...resultado);
            buscarDiscos();
        })
        .catch(mostrarErro);
}

function buscarDiscos() {
    const busca = campoBusca.value.toLowerCase();
    tabelaDiscos.replaceChildren();

    discos.forEach(disco => {
        if (!(disco.titulo || '').toLowerCase().includes(busca)) return;

        adicionarLinha(tabelaDiscos, [
            disco.titulo,
            disco.artista,
            disco.genero,
            Number(disco.preco_custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            Number(disco.preco_venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            disco.quantidade_estoque,
            disco.estoque_minimo
        ], () => editarDisco(disco), () => excluirDisco(disco.id));
    });
}

function novoDisco() {
    discoAtual = undefined;
    document.getElementById('form-titulo').textContent = 'Novo Disco';
    tituloDisco.value = '';
    artistaDisco.value = '';
    generoDisco.value = '';
    custoDisco.value = '';
    precoDisco.value = '';
    quantidadeDisco.value = '';
    estoqueMinimoDisco.value = '';
}

function editarDisco(disco) {
    discoAtual = disco;
    document.getElementById('form-titulo').textContent = 'Editar Disco';
    tituloDisco.value = disco.titulo;
    artistaDisco.value = disco.artista;
    generoDisco.value = disco.genero;
    custoDisco.value = disco.preco_custo;
    precoDisco.value = disco.preco_venda;
    quantidadeDisco.value = disco.quantidade_estoque;
    estoqueMinimoDisco.value = disco.estoque_minimo;
}

function salvarDisco() {
    const dados = {
        titulo: tituloDisco.value.trim(),
        artista: artistaDisco.value.trim(),
        genero: generoDisco.value.trim(),
        preco_custo: Number(custoDisco.value),
        preco_venda: Number(precoDisco.value),
        quantidade_estoque: Number(quantidadeDisco.value),
        estoque_minimo: Number(estoqueMinimoDisco.value)
    };

    const camposNumericos = [custoDisco, precoDisco, quantidadeDisco, estoqueMinimoDisco];
    if (!dados.titulo || !dados.artista || !dados.genero ||
        camposNumericos.some(campo => !campo.value || !campo.checkValidity())) {
        alert('Preencha todos os campos.');
        return;
    }

    const caminho = discoAtual
        ? rotaDiscos + '/atualizar/' + discoAtual.id
        : rotaDiscos + '/cadastrar';
    const metodo = discoAtual ? 'PUT' : 'POST';

    chamarApi(caminho, metodo, dados)
        .then(() => {
            alert(discoAtual ? 'Disco atualizado!' : 'Disco cadastrado!');
            novoDisco();
            carregarDiscos();
        })
        .catch(mostrarErro);
}

function excluirDisco(id) {
    if (!confirm('Deseja excluir este disco?')) return;
    chamarApi(rotaDiscos + '/excluir/' + id, 'DELETE')
        .then(carregarDiscos)
        .catch(mostrarErro);
}

function cancelarEdicao() {
    novoDisco();
}

function carregarMovimentacoes() {
    chamarApi(rotaMovimentacoes + '/listar')
        .then(resultado => {
            listaMovimentacoes.length = 0;
            listaMovimentacoes.push(...resultado);
            listarMovimentacoes();
        })
        .catch(mostrarErro);
}

function listarMovimentacoes() {
    tabelaMovimentacoes.replaceChildren();
    listaMovimentacoes.forEach(item => {
        const disco = item.disco ? item.disco.titulo : item.titulo;
        const usuario = item.usuario ? item.usuario.nome || item.usuario : '';

        adicionarLinha(tabelaMovimentacoes, [
            item.data || item.data_movimentacao,
            disco,
            item.tipo,
            item.quantidade,
            item.status,
            usuario
        ], () => editarMovimentacao(item), () => excluirMovimentacao(item.id));
    });
}

function novaMovimentacao() {
    movimentacaoAtual = undefined;
    document.getElementById('form-movimentacao-titulo').textContent = 'Nova Movimentação';
    tipoMovimentacao.value = 'FABRICADO';
    quantidadeMovimentacao.value = 1;

    const hoje = new Date();
    dataMovimentacao.value = hoje.getFullYear() + '-' +
        String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoje.getDate()).padStart(2, '0');
}

function editarMovimentacao(item) {
    movimentacaoAtual = item;
    document.getElementById('form-movimentacao-titulo').textContent = 'Editar Movimentação';
    tipoMovimentacao.value = item.tipo;
    quantidadeMovimentacao.value = item.quantidade;
    dataMovimentacao.value = (item.data || item.data_movimentacao || '').slice(0, 10);
}

function registrarMovimentacao() {
    const dados = {
        tipo: tipoMovimentacao.value,
        quantidade: Number(quantidadeMovimentacao.value),
        data: dataMovimentacao.value
    };

    if (dados.quantidade < 1 || !dados.data) {
        alert('Informe uma quantidade válida e a data.');
        return;
    }

    const caminho = movimentacaoAtual
        ? rotaMovimentacoes + '/atualizar/' + movimentacaoAtual.id
        : rotaMovimentacoes + '/cadastrar';
    const metodo = movimentacaoAtual ? 'PUT' : 'POST';

    chamarApi(caminho, metodo, dados)
        .then(() => {
            alert(movimentacaoAtual ? 'Movimentação atualizada!' : 'Movimentação registrada!');
            novaMovimentacao();
            carregarMovimentacoes();
        })
        .catch(mostrarErro);
}

function excluirMovimentacao(id) {
    if (!confirm('Deseja excluir esta movimentação?')) return;
    chamarApi(rotaMovimentacoes + '/excluir/' + id, 'DELETE')
        .then(carregarMovimentacoes)
        .catch(mostrarErro);
}

function cancelarEdicaoMovimentacao() {
    novaMovimentacao();
}

if (tabelaDiscos) {
    carregarDiscos();
    campoBusca.addEventListener('input', buscarDiscos);
} else {
    novaMovimentacao();
    carregarMovimentacoes();
}
