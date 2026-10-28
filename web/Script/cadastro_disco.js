const API_URL = 'http://localhost:3000';

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
const tabela = $('tabela-discos');
const campoBusca = $('input-busca');
const campos = {
    titulo: $('disco-titulo'),
    artista: $('disco-artista'),
    genero: $('disco-genero'),
    preco_custo: $('disco-custo'),
    preco_venda: $('disco-preco'),
    quantidade_estoque: $('disco-quantidade'),
    estoque_minimo: $('disco-estoque-minimo')
};

let discos = [];
let discoAtual = null;

const campoNomeUsuario = $('nome-usuario');
if (campoNomeUsuario && usuarioLogado) {
    campoNomeUsuario.textContent = usuarioLogado.nome;
}

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
        ? 'Não foi possível conectar à API. Inicie o backend em http://localhost:3000.'
        : erro.message);
}

function moeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function criarBotao(texto, classe, acao) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = texto;
    botao.className = classe;
    botao.addEventListener('click', acao);
    return botao;
}

async function carregarDiscos() {
    try {
        discos = await chamarApi('/disco/listar');
        buscarDiscos();
    } catch (erro) {
        mostrarErro(erro);
    }
}

function buscarDiscos() {
    if (!tabela) return;

    const busca = (campoBusca?.value || '').trim().toLocaleLowerCase('pt-BR');
    tabela.replaceChildren();

    const encontrados = discos
        .filter((disco) => {
            const texto = `${disco.titulo || ''} ${disco.artista || ''} ${disco.genero || ''}`;
            return texto.toLocaleLowerCase('pt-BR').includes(busca);
        })
        .sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR'));

    const estoqueBaixo = encontrados.filter((disco) =>
        Number(disco.quantidade_estoque) <= Number(disco.estoque_minimo)
    );

    if (estoqueBaixo.length) {
        const linhaAviso = tabela.insertRow();
        const celulaAviso = linhaAviso.insertCell();
        celulaAviso.colSpan = 8;
        celulaAviso.className = 'alerta-estoque';
        celulaAviso.textContent = `Atenção: estoque no mínimo ou abaixo para: ${estoqueBaixo.map((disco) => disco.titulo).join(', ')}.`;
    }

    encontrados.forEach((disco) => {
        const linha = tabela.insertRow();
        [
            disco.titulo,
            disco.artista,
            disco.genero,
            moeda(disco.preco_custo),
            moeda(disco.preco_venda),
            disco.quantidade_estoque,
            disco.estoque_minimo
        ].forEach((valor) => {
            linha.insertCell().textContent = valor ?? '';
        });

        const acoes = linha.insertCell();
        acoes.append(
            criarBotao('Editar', 'btn-primary', () => editarDisco(disco)),
            criarBotao('Excluir', 'btn-danger', () => excluirDisco(disco.id_disco))
        );
    });
}

function novoDisco() {
    discoAtual = null;
    $('form-titulo').textContent = 'Novo Disco';
    Object.values(campos).forEach((campo) => { campo.value = ''; });
    $('btn-cancelar-edicao').style.display = 'none';
    $('btn-salvar').textContent = 'Salvar Disco';
}

function editarDisco(disco) {
    discoAtual = disco;
    $('form-titulo').textContent = 'Editar Disco';
    Object.entries(campos).forEach(([chave, campo]) => {
        campo.value = disco[chave] ?? '';
    });
    $('btn-cancelar-edicao').style.display = 'inline-block';
    $('btn-salvar').textContent = 'Atualizar Disco';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function salvarDisco() {
    const dados = {
        titulo: campos.titulo.value.trim(),
        artista: campos.artista.value.trim(),
        genero: campos.genero.value.trim(),
        preco_custo: Number(campos.preco_custo.value),
        preco_venda: Number(campos.preco_venda.value),
        quantidade_estoque: Number(campos.quantidade_estoque.value),
        estoque_minimo: Number(campos.estoque_minimo.value)
    };

    const camposNumericosVazios = [campos.preco_custo, campos.preco_venda,
        campos.quantidade_estoque, campos.estoque_minimo]
        .some((campo) => campo.value.trim() === '');

    if (!dados.titulo || !dados.artista || !dados.genero || camposNumericosVazios ||
        Object.values(campos).some((campo) => !campo.checkValidity()) ||
        dados.preco_custo < 0 || dados.preco_venda < 0 ||
        !Number.isInteger(dados.quantidade_estoque) || dados.quantidade_estoque < 0 ||
        !Number.isInteger(dados.estoque_minimo) || dados.estoque_minimo < 0) {
        alert('Preencha todos os campos com valores válidos.');
        return;
    }

    try {
        const caminho = discoAtual
            ? `/disco/atualizar/${discoAtual.id_disco}`
            : '/disco/cadastrar';

        await chamarApi(caminho, discoAtual ? 'PUT' : 'POST', dados);
        alert(discoAtual ? 'Disco atualizado com sucesso!' : 'Disco cadastrado com sucesso!');
        novoDisco();
        await carregarDiscos();
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function excluirDisco(id) {
    if (!confirm('Deseja realmente excluir este disco?')) return;
    try {
        await chamarApi(`/disco/excluir/${id}`, 'DELETE');
        await carregarDiscos();
    } catch (erro) {
        mostrarErro(erro);
    }
}

function cancelarEdicao() {
    novoDisco();
}

function sair() {
    sessionStorage.removeItem('usuarioLoja');
    window.location.href = './login.html';
}

$('btn-salvar')?.addEventListener('click', salvarDisco);
$('btn-cancelar-edicao')?.addEventListener('click', cancelarEdicao);
$('btn-logout')?.addEventListener('click', sair);
$('btn-buscar')?.addEventListener('click', buscarDiscos);
campoBusca?.addEventListener('input', buscarDiscos);

if ($('btn-cancelar-edicao')) $('btn-cancelar-edicao').style.display = 'none';
carregarDiscos();
