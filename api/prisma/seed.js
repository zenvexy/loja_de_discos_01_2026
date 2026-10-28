require('dotenv').config()
const prisma = require('../src/data/prisma')

async function main() {
    await prisma.$transaction(async (transaction) => {
        await transaction.movimentacaoEstoque.deleteMany()
        await transaction.disco.deleteMany()
        await transaction.usuario.deleteMany()

        const usuarios = await Promise.all([
            transaction.usuario.create({
                data: {
                    nome: 'Administrador',
                    email: 'admin@lojadevinis.com',
                    senha: '123456'
                }
            }),
            transaction.usuario.create({
                data: {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    senha: 'senha123'
                }
            })
        ])
        console.log('Usuários de teste cadastrados.')

        const discos = await Promise.all([
            transaction.disco.create({
                data: {
                    titulo: 'The Dark Side of the Moon',
                    artista: 'Pink Floyd',
                    genero: 'Rock Progressivo',
                    preco_custo: 120.00,
                    preco_venda: 189.90,
                    quantidade_estoque: 15,
                    estoque_minimo: 3
                }
            }),
            transaction.disco.create({
                data: {
                    titulo: 'Thriller',
                    artista: 'Michael Jackson',
                    genero: 'Pop',
                    preco_custo: 95.00,
                    preco_venda: 149.90,
                    quantidade_estoque: 8,
                    estoque_minimo: 2
                }
            }),
            transaction.disco.create({
                data: {
                    titulo: 'Back in Black',
                    artista: 'AC/DC',
                    genero: 'Rock',
                    preco_custo: 110.00,
                    preco_venda: 169.90,
                    quantidade_estoque: 12,
                    estoque_minimo: 3
                }
            }),
            transaction.disco.create({
                data: {
                    titulo: 'Abbey Road',
                    artista: 'The Beatles',
                    genero: 'Rock',
                    preco_custo: 130.00,
                    preco_venda: 199.90,
                    quantidade_estoque: 5,
                    estoque_minimo: 2
                }
            })
        ])
        console.log('Discos de teste cadastrados.')

        await Promise.all([
            transaction.movimentacaoEstoque.create({
                data: {
                    id_disco: discos[0].id_disco,
                    id_usuario: usuarios[0].id_usuario,
                    tipo_movimentacao: 'entrada',
                    quantidade: 15,
                    data_movimentacao: new Date('2026-10-01'),
                    observacao: 'Cadastro inicial do estoque.'
                }
            }),
            transaction.movimentacaoEstoque.create({
                data: {
                    id_disco: discos[1].id_disco,
                    id_usuario: usuarios[0].id_usuario,
                    tipo_movimentacao: 'entrada',
                    quantidade: 10,
                    data_movimentacao: new Date('2026-10-02'),
                    observacao: 'Reposição de estoque.'
                }
            }),
            transaction.movimentacaoEstoque.create({
                data: {
                    id_disco: discos[1].id_disco,
                    id_usuario: usuarios[1].id_usuario,
                    tipo_movimentacao: 'saida',
                    quantidade: 2,
                    data_movimentacao: new Date('2026-10-05'),
                    observacao: 'Venda de dois discos.'
                }
            }),
            transaction.movimentacaoEstoque.create({
                data: {
                    id_disco: discos[2].id_disco,
                    id_usuario: usuarios[0].id_usuario,
                    tipo_movimentacao: 'entrada',
                    quantidade: 12,
                    data_movimentacao: new Date('2026-10-03'),
                    observacao: 'Cadastro inicial do estoque.'
                }
            }),
            transaction.movimentacaoEstoque.create({
                data: {
                    id_disco: discos[3].id_disco,
                    id_usuario: usuarios[0].id_usuario,
                    tipo_movimentacao: 'entrada',
                    quantidade: 5,
                    data_movimentacao: new Date('2026-10-04'),
                    observacao: 'Cadastro inicial do estoque.'
                }
            })
        ])
        console.log('Movimentações de estoque cadastradas.')
    })
}

main()
    .catch((erro) => {
        console.error(erro)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
