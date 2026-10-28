# Sistema Vinyl Control (Gestão de Acervo e Vendas) 

- ## Documentação de Requisitos
  - ### Contextualização
    Uma tradicional loja física de discos de vinil e colecionáveis enfrenta problemas recorrentes no controle do seu catálogo de álbuns. Devido à alta rotatividade de edições raras e lançamentos, a falta de um sistema informatizado para gerenciar vendas e reposições causa furos no estoque, venda de discos indisponíveis e atraso em novos pedidos com fornecedores. A loja deseja trabalhar com uma gestão de estoque eficiente, mantendo uma margem mínima de segurança para cada título. Atualmente, os registros de entrada (compras de fornecedores) e saída (vendas a clientes) são feitos em cadernos manuais, o que impossibilita a análise de métricas e gera inconsistências financeiras. O estabelecimento atende tanto colecionadores locais quanto compradores eventuais.

  - ## Requisitos funcionais
    - ### [RF001] – Login
      - **Descrição:** O sistema deve permitir que o usuário cadastrado entre no sistema por meio de login e senha.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF002] – Validação de Login
      - **Descrição:** O sistema deve validar as credenciais informadas e apresentar uma mensagem de erro caso o login ou a senha estejam incorretos.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF003] – Gerenciamento de Sessão
      - **Descrição:** O sistema deve criar uma sessão para o usuário autenticado e mantê-la ativa durante a utilização da aplicação.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    -  ### [RF004] – Exibição do Usuário
       - **Descrição:** O sistema deve exibir o nome do usuário autenticado na interface principal.
       - **Atores:** Funcionário.
       - **Prioridade:** Média.
    - ### [RF005] – Navegação Principal
      - **Descrição:** O sistema deve disponibilizar opções para acessar a interface de cadastro de discos e a interface de gestão de acervo e vendas.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF006] – Logout
      - **Descrição:** O sistema deve permitir que o usuário encerre sua sessão e seja redirecionado à interface de login.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF007] – Listagem de Discos
      - **Descrição:** O sistema deve listar os discos cadastrados no banco de dados ao carregar a interface de cadastro de discos.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF008] – Cadastro de Disco
      - **Descrição:** O sistema deve permitir o cadastro de novos discos, armazenando suas informações no banco de dados.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF009] – Edição de Disco
      - **Descrição:** O sistema deve permitir a edição das informações de um disco previamente cadastrado.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF010] – Exclusão de Disco
      - **Descrição:** O sistema deve permitir a exclusão de um disco cadastrado, solicitando confirmação antes de concluir a operação.
      - **Atores:** Funcionário.
      - **Prioridade:** Média.
    - ### [RF011] – Validação de Dados do Disco
      - **Descrição:** O sistema deve validar os campos obrigatórios e os valores informados durante o cadastro e a edição de discos, impedindo o registro de dados inválidos.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.

    - ### [RF012] – Busca de Discos
      - **Descrição:** O sistema deve disponibilizar um campo de busca que permita localizar discos conforme o termo digitado, atualizando a listagem de acordo com os resultados.
      - **Atores:** Funcionário.
      - **Prioridade:** Média.
    - ### [RF013] – Retorno à Interface Principal
      - **Descrição:** O sistema deve disponibilizar uma opção para retornar à interface principal a partir das interfaces de cadastro de discos e gestão de acervo e vendas.
      - **Atores:** Funcionário.
      - **Prioridade:** Média.

    - ### [RF014] – Seleção de Disco para Movimentação
      - **Descrição:** O sistema deve permitir selecionar um disco cadastrado para realizar uma movimentação de estoque.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.

    - ### [RF015] – Tipo de Movimentação
      - **Descrição:** O sistema deve permitir selecionar o tipo de movimentação, classificando-a como entrada (reposição de estoque) ou saída (venda).
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF016] – Registro de Data da Movimentação
      - **Descrição:** O sistema deve permitir informar a data em que ocorreu a entrada ou saída de discos do estoque.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF017] – Atualização de Estoque
      - **Descrição:** O sistema deve atualizar automaticamente a quantidade de discos disponíveis após cada movimentação, aumentando o estoque nas entradas e diminuindo-o nas saídas.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF018] – Histórico de Movimentações
      - **Descrição:** O sistema deve registrar as movimentações realizadas, associando cada registro ao disco correspondente e ao usuário responsável.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.
    - ### [RF019] – Ordenação Alfabética
      - **Descrição:** O sistema deve apresentar a listagem de discos em ordem alfabética, utilizando o título ou nome do disco como critério de ordenação.
      - **Atores:** Funcionário.
      - **Prioridade:** Média.

    - ### [RF020] – Alerta de Estoque Mínimo
      - **Descrição:** O sistema deve verificar a quantidade disponível de cada disco e emitir um alerta quando o estoque estiver   abaixo do limite mínimo configurado.
      - **Atores:** Funcionário.
      - **Prioridade:** Alta.

        ---

  - ## Requisitos não funcionais
      - ### [RNF001] – Segurança das Senhas
        - **Descrição:** O sistema deve armazenar as senhas dos usuários de forma segura, utilizando um algoritmo apropriado de hash, sem armazená-las em texto puro.
        - **Categoria:** Segurança.
        - **Prioridade:** Alta.

      - ### [RNF002] – Controle de Acesso
        - **Descrição:** O sistema deve impedir que usuários não autenticados acessem as interfaces internas da aplicação.
        - **Categoria:** Segurança.
        - **Prioridade:** Alta.

      - ### [RNF003] – Integridade dos Dados
        - **Descrição:** O banco de dados deve utilizar chaves primárias, chaves estrangeiras e restrições de integridade para manter a consistência das informações.
        - **Categoria:** Confiabilidade.
        - **Prioridade:** Alta.

      - ### [RNF004] – Desempenho
        - **Descrição:** O sistema deve carregar as listagens e processar as operações de cadastro, edição, exclusão e movimentação em tempo adequado, considerando as condições do ambiente de execução.
        - **Categoria:** Desempenho.
      - **Prioridade:** Média.

        - ### [RNF005] – Usabilidade
        - **Descrição:** As interfaces devem apresentar campos, botões, menus e mensagens de forma clara, permitindo que o funcionário utilize as funcionalidades sem dificuldade.
        - **Categoria:** Usabilidade.
        - **Prioridade:** Alta.

      - ### [RNF006] – Compatibilidade
        - **Descrição:** Caso o sistema seja desenvolvido como aplicação web, deverá funcionar nos navegadores definidos para o projeto, como Google Chrome e Microsoft Edge.
        - **Categoria:** Compatibilidade.
        - **Prioridade:** Média.

      - ### [RNF007] – Tratamento de Erros
        - **Descrição:** O sistema deve apresentar mensagens claras quando ocorrerem erros de autenticação, falhas de conexão com o banco de dados ou operações inválidas.
        - **Categoria:** Confiabilidade.
        - **Prioridade:** Alta.

      - ### [RNF008] – Consistência do Estoque
        - **Descrição:** As movimentações devem atualizar a quantidade em estoque de maneira consistente, impedindo que uma venda seja concluída quando não houver quantidade suficiente disponível.
        - **Categoria:** Integridade.
        - **Prioridade:** Alta.

      - ### [RNF009] – Manutenibilidade
        - **Descrição:** O código-fonte deve ser organizado de forma que facilite a identificação, correção de erros e implementação de melhorias futuras.
        - **Categoria:** Manutenibilidade.
        - **Prioridade:** Média.

      - ### [RNF010] – Persistência dos Dados
        - **Descrição:** Os dados dos usuários, discos e movimentações devem permanecer armazenados no banco de dados após o encerramento da sessão ou da aplicação.
        - **Categoria:** Confiabilidade.
        - **Prioridade:** Alta.

- ## Documentação de Infraestrura
  - ### Linguagens Utilizadas		
    - JavaScript
    - Html
    - Css
  - ### SGBD e Banco de Dados
    - Xampp(v.3.3.0)
    - Prisma
    - MySql
  - ### Sistema Operacional
    - **Edição:** Windows 11 Pro
    - **Versão:**	25H2

- ## Integrantes e Funções
    |Enzo|Henrique|Nicollas|
    |:-:|:-:|:-:|
    |FrontEnd|BackEnd|FrontEnd e Documentação|

## Estrutura do projeto

- `web/Pages`: telas HTML (login, início, cadastro de discos e gestão de acervo).
- `web/Script`: JavaScript separado por tela.
- `web/Style`: CSS no tema escuro roxo, seguindo a estilização original do projeto.
- `api`: API Express, controllers, rotas e Prisma.

## Como executar

1. Configure as variáveis de banco de dados exigidas pelo Prisma no arquivo `.env` dentro de `api` (use `.env.example` como referência).
2. No terminal, entre em `api` e execute:
   ``` cmd
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```
3. Abra `web/index.html` no navegador. 
