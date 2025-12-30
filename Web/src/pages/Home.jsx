import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Modal from '../components/Modal';
import { getMovies } from '../services/API';

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [todosOsFilmes, setTodosOsFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const [filmeSelecionadoId, setFilmeSelecionadoId] = useState(null);

  const [busca, setBusca] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroAno, setFiltroAno] = useState('');
  const [filtroNota, setFiltroNota] = useState('');

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setCarregando(true);

        const dadosCompletos = await getMovies(''); 
        setTodosOsFilmes(dadosCompletos);
        setFilmes(dadosCompletos);
      }
      catch (erro) {
        console.error("Erro ao carregar lista inicial:", erro);
        alert("Erro ao conectar com a API.");
      }
      finally {
        setCarregando(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  const realizarBusca = async () => {
    try {
      setCarregando(true);
      
      const params = new URLSearchParams();

      if (busca) params.append('series_title', busca);
      if (filtroGenero) params.append('genre', filtroGenero);
      if (filtroAno) params.append('released_year', filtroAno);
      
      const queryString = `?${params.toString()}`;
      
      let dadosFiltrados = await getMovies(queryString);

      if (filtroNota) {
        dadosFiltrados = dadosFiltrados.filter(filme => parseFloat(filme.imdb_rating) >= parseFloat(filtroNota));
      }

      setFilmes(dadosFiltrados);

    }
    catch (erro) {
      console.error("Erro ao buscar:", erro);
    }
    finally {
      setCarregando(false);
    }
  };

  const abrirModal = (filmeClicado) => {
    const indiceReal = todosOsFilmes.findIndex(f => f.series_title === filmeClicado.series_title);

    if (indiceReal !== -1) {
      setFilmeSelecionadoId(indiceReal + 1);
    }
    else {
      console.error("Erro: Filme não encontrado na lista mestre.");
    }
  };

  const lidarComEnter = (e) => {
    if (e.key === 'Enter') {
      realizarBusca();
    }
  };

  return (
    <div className="pagina-home">
      <section className="secao-filtros container">
        <h2 className="titulo-secao">O que você quer assistir?</h2>
        
        <div className="filtros-container">
          <div className="grupo-input">
            <input
              type="text" placeholder="Nome do filme..." className="input-busca" value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={lidarComEnter}
            />
          </div>

          <div className="grupo-select">
            <select
              className="select-filtro" value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}
            >
              <option value="">Todos os Gêneros</option>
              <option value="Action">Ação</option>
              <option value="Drama">Drama</option>
              <option value="Comedy">Comédia</option>
              <option value="Crime">Crime</option>
              <option value="Adventure">Aventura</option>
              <option value="Sci-Fi">Ficção Científica</option>
              <option value="Animation">Animação</option>
              <option value="Horror">Terror</option>
            </select>
          </div>

          <div className="grupo-input">
             <input
              type="number" placeholder="Ano (ex: 2000)" className="input-ano" value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}
            />
          </div>

          <div className="grupo-select">
            <select 
              className="select-filtro" value={filtroNota} onChange={(e) => setFiltroNota(e.target.value)}
            >
              <option value="">Qualquer Nota</option>
              <option value="7">Nota 7+</option>
              <option value="8">Nota 8+</option>
              <option value="9">Nota 9+</option>
            </select>
          </div>

          <button onClick={realizarBusca} className="botao-buscar">Buscar</button>
        </div>
      </section>

      <section className="secao-catalogo container">
        {carregando ? (
          <p className="texto-carregando">Carregando catálogo...</p>
        ) : (
          <>
            <div className="info-resultados">
              <p>{filmes.length} resultados encontrados</p>
            </div>

            <div className="grade-filmes">
              {filmes.length > 0 ? (
                filmes.map((filme, index) => (
                  <MovieCard key={index} filme={filme} aoClicar={() => abrirModal(filme)}/>
                ))
              ) : (
                <p className="sem-resultados">Nenhum filme encontrado com esses filtros.</p>
              )}
            </div>
          </>
        )}
      </section>

      {filmeSelecionadoId && (
        <Modal filmeId={filmeSelecionadoId} aoFechar={() => setFilmeSelecionadoId(null)}/>
      )}

    </div>
  );
}

export default Home;