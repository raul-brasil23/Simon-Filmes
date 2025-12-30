# Simon Filmes - Trilha Trainee Front-end 2025.2

Projeto desenvolvido para a etapa de Trainee 2025.2 (Front-end).
A aplicação é um catálogo interativo que consome uma API RESTful para listar, filtrar e exibir detalhes de filmes do Top 1000 do IMDB.

## 📋 Funcionalidades

* **Listagem de Filmes:** Exibição em grade para Desktop.
* **Filtros Avançados:**
    * Busca por Título.
    * Filtro por Gênero.
    * Filtro por Ano de Lançamento.
    * Filtro por Nota IMDB.
* **Modal de Detalhes:** Ao clicar em um filme, abre-se um modal sobreposto consumindo a rota de detalhes da API.
* **Integração com API:** Todas as buscas são realizadas no Back-End.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React.js + Vite
* **Estilização:** CSS puro
* **API:** Node.js + Express
* **Fonte:** Google Fonts (Montserrat e Open Sans)

## 🔧 Como rodar o projeto localmente

Este repositório contém tanto o Front-End quanto o Back-End (API). É necessário rodar ambos ao mesmo tempo.

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)

---

### Clonar o repositório
Abra seu terminal e clone o projeto para sua máquina:

```bash
git clone https://github.com/raul-brasil23/Simon-Filmes.git
```

Acesse a pasta da API e instale as dependências:

```bash
cd API
npm install
npm start
```

A API rodará em: http://localhost:3000

Abra um novo terminal, acesse a pasta do site e rode:

```bash
cd Web
npm install
npm run dev
```

O site rodará geralmente em: http://localhost:5173