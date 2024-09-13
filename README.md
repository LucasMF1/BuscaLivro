# BuscaLivro

## Descrição

Este projeto, desenvolvido por Lucas Monteiro Freitas, é uma aplicação que permite aos usuários explorar uma coleção de livros utilizando dados de uma API pública, como a Open Library API. Os usuários podem buscar livros por título ou autor, favoritar os livros de sua escolha, adicionar anotações e avaliações pessoais e organizar seus livros favoritos por tags e notas.

## Funcionalidades

- *RF1* - Busca de livros por título ou autor.
- *RF2* - Exibição das informações relevantes dos livros, como título, autor(es), descrição e capa.
- *RF3* - Favoritar livros e adicionar notas pessoais, incluindo uma avaliação (nota de 1 a 5) e tags.
- *RF4* - Listar e gerenciar os livros favoritados.
- *RF5* - Filtrar livros favoritos por notas e tags.

## Como configurar o ambiente para execução

### Pré-requisitos

1. **Node.js**: Certifique-se de ter o [Node.js](https://nodejs.org) instalado (versão recomendada: LTS).
   - Para verificar a versão instalada:
     ```bash
     node -v
     ```

2. **npm**: Certifique-se de ter npm instalado
   - Para verificar a versão instalada:
      ```bash
      npm -v
      ```
      - Caso queira atualizar 
      ```bash
      sudo npm install -g n
      ```
      - Depois
      ```bash
      sudo n latest
      ```

3. **Angular CLI**: Instale o Angular CLI globalmente em sua máquina.
   ```bash
   npm install -g @angular/cli
   ```

### Configuração do Projeto

1. Clone o repositório:
   ```bash
      git clone https://github.com/LucasMF1/BuscaLivro.git
   ```

2. Acesse o diretório do projeto:
   ```bash
      cd book-collection-app
   ```

3. Instale as dependências:
   ```bash
      npm install
   ```

4. Execute o projeto:
   ```bash
      ng serve
   ```

5. Abra o navegador em http://localhost:4200/ para visualizar a aplicação.   