# BuscaLivro

Este projeto, desenvolvido por Lucas Monteiro Freitas, é uma aplicação que permite aos usuários explorar uma coleção de livros utilizando dados de uma API pública, como a Open Library API. Os usuários podem buscar livros por título ou autor, favoritar os livros de sua escolha, adicionar anotações e avaliações pessoais e organizar seus livros favoritos por tags e notas.

## indice 

1. [Descrição](#descrição)
2. [Funcionalidades](#funcionalidades)
3. [Pré-requisitos](#pré-requisitos)
4. [Instalação](#instalação)
5. [Configuração](#configuração)
6. [Como executar](#como-executar)
7. [Comandos importantes](#comandos-importantes)
8. [Estrutura do projeto](#estrutura-do-projeto)
9. [Contribuindo](#contribuindo)
10. [Licença](#licença)

## descrição

O Buscador de Livros é uma aplicação web que permite aos usuários buscar livros através da API Open Library, favoritar seus livros preferidos e fazer anotações e avaliações em seus livros favoritos. O projeto é desenvolvido utilizando Angular no frontend e Node.js com SQLite no backend.


## Funcionalidades

- RF1 - Busca de livros por título ou autor.
- RF2 - Exibição das informações relevantes dos livros, como título, autor(es), descrição e capa.
- RF3 - Favoritar livros e adicionar notas pessoais, incluindo uma avaliação (nota de 1 a 5) e tags.
- RF4 - Listar e gerenciar os livros favoritados.
- RF5 - Filtrar livros favoritos por notas e tags.


## Pré-requisitos

Os seguintes softwares devem estar instalados em sua máquina.

1. Node.js: Certifique-se de ter o [Node.js](https://nodejs.org) instalado (versão recomendada: v14 ou superior).
2. npm: Certifique-se de ter o npm instalado (v6 ou superior).
3. Angular CLI: Instale o Angular CLI globalmente em sua máquina.
4. SQLite3: Instale o SQLite3.

## Instalação

1. clone o repositório do projeto:
   ```bash
   git clone https://github.com/LucasMF1/BuscaLivro.git

   cd BuscaLivro/BuscadorLivros.app
   ```

2. Instalação dos pré-requisitos: (No Ubuntu)
   - Node.js: como instalar
   ```bash
   sudo apt update

   sudo apt install -y nodejs
   ```

   - npm: Como instalar
   ```bash
   sudo apt install npm
   ```

   - Angular CLI: Como instalar
   ```bash
   sudo npm install -g @angular/cli
   ```

   - SQLite3: Como instalar
   ```bash
   sudo apt install sqlite
   ```

## Configuração 


### Configuração do frontend

1. Navegue para o diretório do frontend:

   ```bash
   cd BuscadorLivros.app
   ```

2. Instale as dependências do frontend:

   ```bash
   npm install
   ```
### Configuração do backend

1. Navegue para o diretório do backend:

   ```bash
   cd backend
   ```

2. Instale as dependências do backend:

   ```bash
   npm install
   ```

3. Inicialize o banco de dados:

   ```bash
   npm run init-db
   ```

## Como executar

Existem dois serviços principais no projeto: frontend (Angular) e backend (Node.js/Express com SQLite). Veja como executá-los :

### Frontend

1. Inicie o servidor Node.js/Express para a API
   ```bash
   npm start
   ```

2. O projeto Angular será acessível, via navegador, em http://localhost:4200.

### Backend

1. Inicie o servidor Node.js/Express para a API:
   ```bash
   npm run start
   ```

2. O backend estará rodando em http://localhost:3000.

## Comandos importantes

- npm start: Inicia o servidor de desenvolvimento Angular.
- npm run start: Inicia o servidor Node.js/Express (backend).
- npm run init-db: Inicializa o banco de dados SQLite.
- npm run lint: Roda o linter para verificar a qualidade do código.

## Estrutura do projeto
   bash
   BuscadorLivros.app/           # Raiz do projeto
   ── backend/                  # Diretório do backend (Node.js, Express, SQLite)
   │
   ├── src/                      # Diretório principal do frontend (Angular)
   │   ├── app/                  # Diretório do código-fonte da aplicação
   │   │   ├── favorites/        # Módulo/componentes de favoritos
   │   │   │   
   │   │   ├── login/            # Módulo/componentes de login
   │   │   │   
   │   │   ├── register/         # Módulo/componentes de registro de usuário
   │   │   │ 
   │   ├── index.html            # Página HTML principal
   │   ├── main.ts               # Arquivo principal do Angular
   │   ├── styles.css            # Estilos globais 
   │
   ├── package.json              # Configurações e scripts do frontend
   ├── README.md                 # Documentação do projeto
   ├── LICENSE                   # Arquivo de licença

   

- src/app: Contém os componentes e serviços do Angular.
- server.js: Backend usando Node.js e Express.
- favorites.db: Arquivo de banco de dados SQLite para armazenar favoritos e usuários.
- package.json: Lista as dependências e scripts npm.

## Contribuindo 

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do projeto (no github clique em fork).
2. Crie uma branch para sua modificação (git checkout -b feature/nova-funcionalidade).
3. Commit suas mudanças (git commit -m 'Adiciona nova funcionalidade').
4. Push para a branch (git push origin feature/nova-funcionalidade).
5. Abra um Pull Request.

Certifique-se de seguir os padrões de código e rodar o linter com npm run lint antes de enviar sua contribuição.

## Licença
Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.