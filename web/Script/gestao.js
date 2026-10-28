const API_URL = 'http://localhost:3000';
const rotaDiscos = '/disco';
const rotaUsuarios = '/usuario';
const rotaMovimentacoes = '/movimentacao';

const usuarioSalvo = sessionStorage.getItem('usuarioLoja');
if (!usuarioSalvo) {
    window.location.replace('./login.html');
}

let usuarioLogado = null;
try {
    usuarioLogado = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
} catch {
    sessionStorage.removeItem('usuarioLoja');
    window.location.replace('./login.html');
}

const $ = (id) => document.getElementById(id);
const tabelaMovimentacoes = $('tabela-movimentacoes');
const selectDisco = $('select-disco');
const selectUsuario = $('select-usuario');
const tipoMovimentacao = $('select-tipo');
const quantidadeMovimentacao = $('input-quantidade');
const dataMovimentacao = $('input-data');
const campoObservacao = $('input-observacao');
const idMovimentacao = $('movimentacao-id');
const botaoRegistrar = $('btn-registrar');
const botaoCancelar = $('btn-cancelar-edicao-movimentacao');

let discos = [];
let listaMovimentacoes = [];
let movimentacaoAtual = null;

const campoNomeUsuario = $('nome-usuario');
if (campoNomeUsuario && usuarioLogado) campoNomeUsuario.textContent = usuarioLogado.nome;

async function chamarApi(caminho, metodo = 'GET', dados) {
    const opcoes = { method: metodo, headers: { 'Content-Type': 'application/json' } };
    if (dados !== undefined) opcoes.body = JSON.stringify(dados);

    const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
    const resultado = resposta.status === 204 ? {} : await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || resultado.detalhe || 'Erro na API.');
    return resultado;
}

function mostrarErro(erro) {
    alert(erro.message.includes('Failed to fetch')
        ? 'Problemas na conexão com a API. Verifique se o backend está rodando em http://localhost:3000.'
        : erro.message);
}

function dataHoje() {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}

function formatarData(data) {
    if (!data) return '';
    const valor = String(data).slice(0, 10);
    const partes = valor.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : valor;
}

function criarBotao(texto, classe, acao) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = texto;
    botao.className = classe;
    botao.addEventListener('click', acao);
    return botao;
}

function adicionarLinha(tabela, valores, aoEditar, aoExcluir) {
    const linha = tabela.insertRow();
    valores.forEach((valor) => {
        linha.insertCell().textContent = valor === undefined || valor === null ? '' : valor;
    });
    const acoes = linha.insertCell();
    acoes.append(
        criarBotao('Editar', 'btn-primary', aoEditar),
        criarBotao('Excluir', 'btn-danger', aoExcluir)
    );
}

async function carregarOpcoes() {
    const [resultadoDiscos, usuarios] = await Promise.all([
        chamarApi(`${rotaDiscos}/listar`),
        chamarApi(`${rotaUsuarios}/listar`)
    ]);

    discos = resultadoDiscos;
    selectDisco.replaceChildren(new Option('Selecione um disco', ''));
    discos.slice().sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR')).forEach((disco) => {
        selectDisco.add(new Option(
            `${disco.titulo} — estoque: ${disco.quantidade_estoque}`,
            String(disco.id_disco)
        ));
    });

    selectUsuario.replaceChildren(new Option('Selecione um usuário', ''));
    usuarios.forEach((usuario) => {
        selectUsuario.add(new Option(usuario.nome, String(usuario.id_usuario)));
    });

    if (usuarioLogado?.id_usuario) selectUsuario.value = String(usuarioLogado.id_usuario);
}

async function carregarDiscos() {
    discos = await chamarApi(`${rotaDiscos}/listar`);
    const selecionado = selectDisco.value;
    selectDisco.replaceChildren(new Option('Selecione um disco', ''));
    discos.slice().sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR')).forEach((disco) => {
        selectDisco.add(new Option(
            `${disco.titulo} — estoque: ${disco.quantidade_estoque}`,
            String(disco.id_disco)
        ));
    });
    if (selecionado) selectDisco.value = selecionado;
}

async function carregarMovimentacoes() {
    listaMovimentacoes = await chamarApi(`${rotaMovimentacoes}/listar`);
    listarMovimentacoes();
}

function listarMovimentacoes() {
    tabelaMovimentacoes.replaceChildren();

    const discosBaixos = discos.filter((disco) =>
        Number(disco.quantidade_estoque) <= Number(disco.estoque_minimo)
    );

    if (discosBaixos.length > 0) {
        const linhaAviso = tabelaMovimentacoes.insertRow();
        const celulaAviso = linhaAviso.insertCell();
        celulaAviso.colSpan = 7;
        celulaAviso.className = 'alerta-estoque';
        celulaAviso.textContent = `Alerta de estoque mínimo: ${discosBaixos.map((disco) => `${disco.titulo} (${disco.quantidade_estoque} un.)`).join(', ')}.`;
    }

    listaMovimentacoes
        .slice()
        .sort((a, b) => (a.disco?.titulo || '').localeCompare(b.disco?.titulo || '', 'pt-BR'))
        .forEach((item) => {
            adicionarLinha(tabelaMovimentacoes, [
                formatarData(item.data_movimentacao),
                item.disco?.titulo || `Disco #${item.id_disco}`,
                item.tipo_movimentacao === 'entrada' ? 'Entrada' : 'Saída',
                item.quantidade,
                item.observacao || '—',
                item.usuario?.nome || `Usuário #${item.id_usuario}`
            ], () => editarMovimentacao(item), () => excluirMovimentacao(item.id_movimentacao));
        });
}

function novaMovimentacao() {
    movimentacaoAtual = null;
    if (idMovimentacao) idMovimentacao.value = '';
    $('form-movimentacao-titulo').textContent = 'Nova Movimentação';
    selectDisco.value = '';
    tipoMovimentacao.value = 'entrada';
    quantidadeMovimentacao.value = 1;
    dataMovimentacao.value = dataHoje();
    if (campoObservacao) campoObservacao.value = '';
    if (usuarioLogado?.id_usuario) selectUsuario.value = String(usuarioLogado.id_usuario);
    else selectUsuario.value = '';
    botaoRegistrar.textContent = 'Registrar';
    botaoCancelar.style.display = 'none';
}

function editarMovimentacao(item) {
    movimentacaoAtual = item;
    $('form-movimentacao-titulo').textContent = 'Editar Movimentação';
    if (idMovimentacao) idMovimentacao.value = item.id_movimentacao;
    selectDisco.value = String(item.id_disco);
    selectUsuario.value = String(item.id_usuario);
    tipoMovimentacao.value = item.tipo_movimentacao;
    quantidadeMovimentacao.value = item.quantidade;
    dataMovimentacao.value = String(item.data_movimentacao || '').slice(0, 10);
    if (campoObservacao) campoObservacao.value = item.observacao || '';
    botaoRegistrar.textContent = 'Atualizar';
    botaoCancelar.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function registrarMovimentacao() {
    const dados = {
        id_disco: Number(selectDisco.value),
        id_usuario: Number(selectUsuario.value),
        tipo_movimentacao: tipoMovimentacao.value,
        quantidade: Number(quantidadeMovimentacao.value),
        data_movimentacao: dataMovimentacao.value,
        observacao: campoObservacao ? campoObservacao.value.trim() : ''
    };

    if (!dados.id_disco || !dados.id_usuario || !['entrada', 'saida'].includes(dados.tipo_movimentacao) ||
        !Number.isInteger(dados.quantidade) || dados.quantidade < 1 || !dados.data_movimentacao) {
        alert('Selecione o disco e o usuário, informe o tipo, uma quantidade inteira maior que zero e a data.');
        return;
    }

    try {
        const caminho = movimentacaoAtual
            ? `${rotaMovimentacoes}/atualizar/${movimentacaoAtual.id_movimentacao}`
            : `${rotaMovimentacoes}/cadastrar`;
        await chamarApi(caminho, movimentacaoAtual ? 'PUT' : 'POST', dados);
        alert(movimentacaoAtual ? 'Movimentação atualizada!' : 'Movimentação registrada!');
        novaMovimentacao();
        await carregarDiscos();
        await carregarMovimentacoes();
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirMovimentacao(id) {
    if (!confirm('Deseja excluir esta movimentação? O estoque será ajustado pelo backend.')) return;
    try {
        await chamarApi(`${rotaMovimentacoes}/excluir/${id}`, 'DELETE');
        alert('Movimentação excluída!');
        await carregarDiscos();
        await carregarMovimentacoes();
    } catch (erro) {
        mostrarErro(erro);
    }
}

function cancelarEdicaoMovimentacao() {
    novaMovimentacao();
}

function sair() {
    sessionStorage.removeItem('usuarioLoja');
    window.location.href = './login.html';
}

botaoRegistrar?.addEventListener('click', registrarMovimentacao);
botaoCancelar?.addEventListener('click', cancelarEdicaoMovimentacao);
$('btn-logout')?.addEventListener('click', sair);

if (botaoCancelar) botaoCancelar.style.display = 'none';

async function iniciarPagina() {
    try {
        await carregarOpcoes();
        await carregarMovimentacoes();
        novaMovimentacao();
    } catch (erro) {
        mostrarErro(erro);
    }
}

iniciarPagina();
