const prisma = require("../data/prisma");

const listar = async (req, res) => {
    try {
        const lista = await prisma.disco.findMany();

        return res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao listar discos" });
    }
};

const cadastrar = async (req, res) => {
    try {
        const disco = req.body;

        const item = await prisma.disco.create({
            data: disco
        });

        return res.status(201).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao cadastrar disco" });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.disco.findUnique({
            where: { id_disco: Number(id) },
            include: { movimentacoes: true }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar disco" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const item = await prisma.disco.update({
            where: { id_disco: Number(id) },
            data: dados
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao atualizar disco" });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.disco.delete({
            where: { id_disco: Number(id) }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao excluir disco" });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};
