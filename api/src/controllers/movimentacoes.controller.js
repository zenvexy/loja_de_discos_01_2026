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
        const dados = req.body;

        const item = await prisma.$transaction(async (tx) => {
            const disco = await tx.disco.findUnique({
                where: { id_disco: Number(dados.id_disco) }
            });

            if (!disco) {
                throw new Error("Disco não encontrado.");
            }

            const quantidade = Number(dados.quantidade);

            if (
                !Number.isInteger(quantidade) ||
                quantidade <= 0
            ) {
                throw new Error("Quantidade inválida.");
            }

            const novoEstoque =
                dados.tipo_movimentacao === "entrada"
                    ? disco.quantidade_estoque + quantidade
                    : dados.tipo_movimentacao === "saida"
                        ? disco.quantidade_estoque - quantidade
                        : -1;

            if (novoEstoque < 0) {
                throw new Error("Tipo inválido ou estoque insuficiente.");
            }

            await tx.disco.update({
                where: { id_disco: Number(dados.id_disco) },
                data: { quantidade_estoque: novoEstoque }
            });

            return await tx.movimentacaoEstoque.create({
                data: {
                    ...dados,
                    id_disco: Number(dados.id_disco),
                    id_usuario: Number(dados.id_usuario),
                    quantidade,
                    data_movimentacao: new Date(
                        `${dados.data_movimentacao}T12:00:00`
                    )
                }
            });
        });

        return res.status(201).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(400).json({
            erro: erro.message || "Erro ao cadastrar movimentação."
        });
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
            data: {
                ...dados,
                data_movimentacao: new Date(
                    `${dados.data_movimentacao}T12:00:00`
                )
            }
        });

        return res.status(200).json(item);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            erro: "Erro ao atualizar movimentação"
        });
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
