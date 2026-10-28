const prisma = require("../data/prisma");

const listar = async (req, res) => {
    try {
        const lista = await prisma.movimentacaoEstoque.findMany({
            include: { disco: true, usuario: true }
        });

        return res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao listar movimentações" });
    }
};

const cadastrar = async (req, res) => {
    try {
        const movimentacao = req.body;

        const item = await prisma.movimentacaoEstoque.create({
            data: movimentacao
        });

        return res.status(201).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao cadastrar movimentação" });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.movimentacaoEstoque.findUnique({
            where: { id_movimentacao: Number(id) },
            include: { disco: true, usuario: true }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar movimentação" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const item = await prisma.movimentacaoEstoque.update({
            where: { id_movimentacao: Number(id) },
            data: dados
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao atualizar movimentação" });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.movimentacaoEstoque.delete({
            where: { id_movimentacao: Number(id) }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao excluir movimentação" });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};
