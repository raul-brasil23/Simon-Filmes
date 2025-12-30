const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
let movies = [];

fs.createReadStream('imdb_top_1000.csv')
  .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
  .on('data', (data) => {
    //Normalização/remoção de espaços em branco e conversão de campos numéricos comuns
    const normalized = {};
    for (const key in data) {
      let val = data[key];
      if (typeof val === 'string') val = val.trim();
      if (val === '') val = null;

      // Conversão numérica para campos conhecidos
      if (val !== null) {
        if (['imdb_rating', 'meta_score'].includes(key)) {
          const num = parseFloat(val.toString().replace(/,/g, '.'));
          normalized[key] = isNaN(num) ? null : num;
          continue;
        }
        if (['no_of_votes', 'released_year', 'gross'].includes(key)) {
          const digits = val.toString().replace(/[^0-9\-\.]/g, '');
          const intVal = parseInt(digits, 10);
          normalized[key] = isNaN(intVal) ? null : intVal;
          continue;
        }
      }

      normalized[key] = val;
    }

    movies.push(normalized);
  })
  .on('end', () => {
    console.log('CSV carregado com sucesso');
  })
  .on('error', (err) => {
    console.error('Erro ao carregar o CSV:', err);
  });

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de Filmes IMDB! Esta API expõe dados dos top 1000 filmes do IMDB carregados de um arquivo CSV.',
    availableRoutes: [
      {
        method: 'GET',
        path: '/movies',
        description: 'Retorna todos os filmes com suporte a filtragem, ordenação e paginação opcional via query strings.',
        queryParams: [
          'Filtros: Qualquer campo do dataset (ex: ?genre=Drama – busca parcial por "contains")',
          'Ordenação: ?sort=campo:asc|desc (ex: ?sort=imdb_rating:desc)',
          'Paginação: ?pag=número&pag-size=número (ex: ?pag=1&pag-size=10)'
        ],
        examples: [
          'GET /movies',
          'GET /movies?director=Christopher%20Nolan',
          'GET /movies?sort=released_year:asc&pag=1&pag-size=5'
        ]
      },
      {
        method: 'GET',
        path: '/movies/:id',
        description: 'Retorna um filme específico pelo ID (índice baseado em 1, do primeiro ao 1000º filme).',
        examples: ['GET /movies/1']
      }
    ],
    fieldsAvailable: [
      'poster_link', 'series_title', 'released_year', 'certificate', 'runtime',
      'genre', 'imdb_rating', 'overview', 'meta_score', 'director',
      'star1', 'star2', 'star3', 'star4', 'no_of_votes', 'gross'
    ],
    note: 'Use codificação URL para espaços em query params (ex: %20 para espaço). Filtragem é case-insensitive e por contenção de string.'
  });
});

app.get('/movies', (req, res) => {
  try {
    let filteredMovies = [...movies];

    // Comparação numérica (campos inteiros)
    const intFields = ['no_of_votes', 'released_year', 'gross'];
    for (const f of intFields) {
      const gt = req.query[`${f}_gt`];
      const lt = req.query[`${f}_lt`];
      const eq = req.query[`${f}_eq`];
      if (gt !== undefined) {
        const n = parseInt(gt, 10);
        if (isNaN(n)) return res.status(400).json({ error: `Parâmetro inválido para ${f}_gt` });
        filteredMovies = filteredMovies.filter(m => typeof m[f] === 'number' && m[f] > n);
      }
      if (lt !== undefined) {
        const n = parseInt(lt, 10);
        if (isNaN(n)) return res.status(400).json({ error: `Parâmetro inválido para ${f}_lt` });
        filteredMovies = filteredMovies.filter(m => typeof m[f] === 'number' && m[f] < n);
      }
      if (eq !== undefined) {
        const n = parseInt(eq, 10);
        if (isNaN(n)) return res.status(400).json({ error: `Parâmetro inválido para ${f}_eq` });
        filteredMovies = filteredMovies.filter(m => typeof m[f] === 'number' && m[f] === n);
      }
    }

    // Filtragem por campos via query string (busca parcial, case-insensitive)
    for (let key in req.query) {
      if (key !== 'sort' && key !== 'pag' && key !== 'pag-size') {
        if (/(_gt|_lt|_eq)$/.test(key)) continue;
        filteredMovies = filteredMovies.filter(movie => 
          movie[key] && movie[key].toString().toLowerCase().includes(req.query[key].toLowerCase())
        );
      }
    }

    if (req.query.sort) {
      const [field, order = 'asc'] = req.query.sort.split(':');
      filteredMovies.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (!isNaN(valA)) valA = parseFloat(valA);
        if (!isNaN(valB)) valB = parseFloat(valB);
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (order === 'desc') {
          return valA < valB ? 1 : (valA > valB ? -1 : 0);
        } else {
          return valA > valB ? 1 : (valA < valB ? -1 : 0);
        }
      });
    }

    if (req.query.pag) {
      const page = parseInt(req.query.pag) || 1;
      const pageSize = parseInt(req.query['pag-size']) || 10;
      if (page < 1 || pageSize < 1) {
        return res.status(400).json({ error: 'Parâmetros de paginação inválidos' });
      }
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      filteredMovies = filteredMovies.slice(start, end);
    }

    res.json(filteredMovies);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.get('/movies/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1 || id > movies.length) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }
    res.json(movies[id - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});