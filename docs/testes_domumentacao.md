# Documentação e casos de teste

## 1. Informações gerais

| Campo | Valor |
|---|---|
| Sistema | Controle de Discos e Movimentações |
| Equipe | Enzo, Nicollas e Henrique |
| Data | 23/10/2026 |
| Front-end | `web/cadastro_discos.html` e `web/gestao.html` |
| Endereço da API | `http://localhost:3000` |

## 2. O que o script faz

O arquivo `web/script.js` identifica a página pelos elementos da tabela:

- **Cadastro de Discos:** carrega os discos, permite buscar por título e cadastrar, editar ou excluir registros.
- **Gestão de Discos:** carrega as movimentações e permite registrar, editar ou excluir registros.

Após cadastrar ou editar, o script limpa o formulário e carrega a lista novamente. A exclusão pede confirmação. Erros nas chamadas à API mostram o alerta **“Problemas com a conexão da API”**.

### Campos enviados

**Disco**

| Campo | Tipo |
|---|---|
| `titulo` | texto |
| `artista` | texto |
| `genero` | texto |
| `preco_custo` | número |
| `preco_venda` | número |
| `quantidade_estoque` | número |
| `estoque_minimo` | número |

O script exige título, artista, gênero e os quatro campos numéricos preenchidos. Os campos numéricos também respeitam as restrições definidas no HTML, como o mínimo zero.

**Movimentação**

| Campo | Tipo |
|---|---|
| `tipo` | texto (`FABRICADO` ou `PEDIDO`) |
| `quantidade` | número |
| `data` | data |

A quantidade precisa ser maior ou igual a 1 e a data precisa estar preenchida.

### Rotas usadas

| Ação | Método | Rota |
|---|---|---|
| Listar discos | GET | `/disco/listar` |
| Cadastrar disco | POST | `/disco/cadastrar` |
| Atualizar disco | PUT | `/disco/atualizar/:id` |
| Excluir disco | DELETE | `/disco/excluir/:id` |
| Listar movimentações | GET | `/movimentacao/listar` |
| Registrar movimentação | POST | `/movimentacao/cadastrar` |
| Atualizar movimentação | PUT | `/movimentacao/atualizar/:id` |
| Excluir movimentação | DELETE | `/movimentacao/excluir/:id` |

## 3. Casos de teste: Discos

### CT-01 — Listar discos ao abrir a página

- **Prioridade:** Alta
- **Pré-condição:** API ligada e com discos cadastrados.

**Passos**
1. Abrir `web/cadastro_discos.html`.

**Resultado esperado:** A tabela mostra título, artista, gênero, custo e preço de venda em reais, quantidade em estoque e estoque mínimo. O ID não é exibido.

**Resultado obtido:**

**Status:** ⬜

---

### CT-02 — Buscar disco pelo título

- **Prioridade:** Média
- **Pré-condição:** Há discos cadastrados.
- **Dados de entrada:** Parte de um título existente, por exemplo, `abbey`.

**Passos**
1. Abrir a página de cadastro de discos.
2. Digitar o texto no campo de busca.

**Resultado esperado:** A tabela mostra apenas discos cujo título contém o texto, sem diferenciar maiúsculas de minúsculas.

**Resultado obtido:**

**Status:** ⬜

---

### CT-03 — Cadastrar disco com dados válidos

- **Prioridade:** Alta
- **Dados de entrada:** Título `Disco 1`, artista `Artista 1`, gênero `Rock`, custo `10`, venda `13`, quantidade `5`, estoque mínimo `2`.

**Passos**
1. Preencher todos os campos do formulário.
2. Clicar em **Salvar Disco**.

**Resultado esperado:** O sistema mostra a confirmação de cadastro, limpa o formulário e atualiza a tabela com o novo disco.

**Resultado obtido:**

**Status:** ⬜

---

### CT-04 — Tentar cadastrar disco com campo obrigatório vazio

- **Prioridade:** Alta
- **Dados de entrada:** Deixar vazio o título, o artista ou um dos campos numéricos.

**Passos**
1. Preencher parcialmente o formulário.
2. Clicar em **Salvar Disco**.

**Resultado esperado:** O sistema mostra o alerta **“Preencha todos os campos.”** e não envia o cadastro.

**Resultado obtido:**

**Status:** ⬜

---

### CT-05 — Editar disco existente

- **Prioridade:** Alta
- **Pré-condição:** Existe ao menos um disco cadastrado.

**Passos**
1. Clicar em **Editar** no disco.
2. Alterar o preço de venda.
3. Clicar em **Salvar Disco**.

**Resultado esperado:** O formulário mostra **Editar Disco** com os dados existentes; após salvar, aparece a confirmação e a tabela exibe o valor atualizado.

**Resultado obtido:**

**Status:** ⬜

---

### CT-06 — Cancelar edição de disco

- **Prioridade:** Baixa
- **Pré-condição:** Existe ao menos um disco cadastrado.

**Passos**
1. Clicar em **Editar** no disco.
2. Clicar em **Cancelar Edição**.

**Resultado esperado:** O formulário é limpo e volta ao estado **Novo Disco**, sem enviar alterações.

**Resultado obtido:**

**Status:** ⬜

---

### CT-07 — Excluir disco confirmando

- **Prioridade:** Alta
- **Pré-condição:** Existe ao menos um disco cadastrado.

**Passos**
1. Clicar em **Excluir** no disco.
2. Confirmar na janela.

**Resultado esperado:** A tabela é carregada novamente e o disco excluído não aparece.

**Resultado obtido:**

**Status:** ⬜

---

### CT-08 — Excluir disco cancelando

- **Prioridade:** Média
- **Pré-condição:** Existe ao menos um disco cadastrado.

**Passos**
1. Clicar em **Excluir** no disco.
2. Cancelar na janela.

**Resultado esperado:** A exclusão não é enviada e o disco continua na tabela.

**Resultado obtido:**

**Status:** ⬜

---

### CT-09 — API fora do ar na página de discos

- **Prioridade:** Média
- **Pré-condição:** API desligada.

**Passos**
1. Abrir `web/cadastro_discos.html`.

**Resultado esperado:** O sistema mostra o alerta **“Problemas com a conexão da API”**.

**Resultado obtido:**

**Status:** ⬜

## 4. Casos de teste: Movimentações

### CT-10 — Abrir a página de movimentações

- **Prioridade:** Alta
- **Pré-condição:** API ligada.

**Passos**
1. Abrir `web/gestao.html`.

**Resultado esperado:** O formulário inicia como **Nova Movimentação**, com tipo `FABRICADO`, quantidade `1` e a data atual. A tabela mostra os dados das movimentações retornadas pela API, sem exibir o ID.

**Resultado obtido:**

**Status:** ⬜

---

### CT-11 — Registrar movimentação válida

- **Prioridade:** Alta
- **Dados de entrada:** Tipo `FABRICADO`, quantidade `5` e data atual.

**Passos**
1. Preencher o formulário.
2. Clicar em **Registrar**.

**Resultado esperado:** O sistema mostra a confirmação, limpa o formulário e atualiza a tabela.

**Resultado obtido:**

**Status:** ⬜

---

### CT-12 — Tentar registrar quantidade inválida

- **Prioridade:** Alta
- **Dados de entrada:** Quantidade `0`, negativa ou vazia.

**Passos**
1. Informar uma quantidade inválida.
2. Clicar em **Registrar**.

**Resultado esperado:** O sistema mostra **“Informe uma quantidade válida e a data.”** e não envia a movimentação.

**Resultado obtido:**

**Status:** ⬜

---

### CT-13 — Tentar registrar sem data

- **Prioridade:** Média

**Passos**
1. Apagar a data.
2. Clicar em **Registrar**.

**Resultado esperado:** O sistema mostra **“Informe uma quantidade válida e a data.”** e não envia a movimentação.

**Resultado obtido:**

**Status:** ⬜

---

### CT-14 — Editar movimentação

- **Prioridade:** Alta
- **Pré-condição:** Existe ao menos uma movimentação.

**Passos**
1. Clicar em **Editar** em uma movimentação.
2. Alterar a quantidade.
3. Clicar em **Registrar**.

**Resultado esperado:** O formulário mostra **Editar Movimentação** com os dados existentes; após salvar, a tabela é atualizada.

**Resultado obtido:**

**Status:** ⬜

---

### CT-15 — Cancelar edição de movimentação

- **Prioridade:** Baixa
- **Pré-condição:** Existe ao menos uma movimentação.

**Passos**
1. Clicar em **Editar** em uma movimentação.
2. Clicar em **Cancelar Edição**.

**Resultado esperado:** O formulário volta ao estado inicial e nenhuma alteração é enviada.

**Resultado obtido:**

**Status:** ⬜

---

### CT-16 — Excluir movimentação

- **Prioridade:** Alta
- **Pré-condição:** Existe ao menos uma movimentação.

**Passos**
1. Clicar em **Excluir** em uma movimentação.
2. Confirmar na janela.

**Resultado esperado:** A tabela é carregada novamente e a movimentação excluída não aparece. Se cancelar, nada é alterado.

**Resultado obtido:**

**Status:** ⬜

---

### CT-17 — API fora do ar na página de movimentações

- **Prioridade:** Média
- **Pré-condição:** API desligada.

**Passos**
1. Abrir `web/gestao.html`.

**Resultado esperado:** O sistema mostra o alerta **“Problemas com a conexão da API”**.

**Resultado obtido:**

**Status:** ⬜

## 5. Resumo da execução

| ID | Módulo | Caso | Prioridade | Status |
|---|---|---|---|---|
| CT-01 | Discos | Listar discos | Alta | ⬜ |
| CT-02 | Discos | Buscar por título | Média | ⬜ |
| CT-03 | Discos | Cadastrar disco válido | Alta | ⬜ |
| CT-04 | Discos | Validar campos obrigatórios | Alta | ⬜ |
| CT-05 | Discos | Editar disco | Alta | ⬜ |
| CT-06 | Discos | Cancelar edição de disco | Baixa | ⬜ |
| CT-07 | Discos | Excluir disco | Alta | ⬜ |
| CT-08 | Discos | Cancelar exclusão de disco | Média | ⬜ |
| CT-09 | Discos | API fora do ar | Média | ⬜ |
| CT-10 | Movimentações | Abrir página | Alta | ⬜ |
| CT-11 | Movimentações | Registrar válida | Alta | ⬜ |
| CT-12 | Movimentações | Validar quantidade | Alta | ⬜ |
| CT-13 | Movimentações | Validar data | Média | ⬜ |
| CT-14 | Movimentações | Editar movimentação | Alta | ⬜ |
| CT-15 | Movimentações | Cancelar edição | Baixa | ⬜ |
| CT-16 | Movimentações | Excluir movimentação | Alta | ⬜ |
| CT-17 | Movimentações | API fora do ar | Média | ⬜ |

**Totais:** Passou: __ | Falhou: __ | Não executado: 17
