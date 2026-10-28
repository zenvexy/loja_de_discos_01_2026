const prisma = require("../data/prisma");

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ erro: "Informe e-mail e senha." });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({ erro: "E-mail ou senha inválidos." });
        }

        return res.status(200).json({
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao realizar login." });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.usuario.findMany();

        return res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao listar usuários" });
    }
};

const cadastrar = async (req, res) => {
    try {
        const usuario = req.body;

        const item = await prisma.usuario.create({
            data: usuario
        });

        return res.status(201).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.usuario.findUnique({
            where: { id_usuario: Number(id) },
            include: { movimentacoes: true }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const item = await prisma.usuario.update({
            where: { id_usuario: Number(id) },
            data: dados
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await prisma.usuario.delete({
            where: { id_usuario: Number(id) }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao excluir usuário" });
    }
};

module.exports = {
    login,
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};
