import React, {useEffect, useState} from 'react';

function Modal({filmeId, aoFechar}) {
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const resposta = await fetch(`/movies/${filmeId}`);
        const dados = await resposta.json();
        setDetalhes(dados);
      }
      catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);
      }
    };

    if (filmeId) {
      buscarDetalhes();
    }
  }, [filmeId]);

  if (!detalhes) return null;

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-fechar" onClick={aoFechar}>X</button>
        
        <h2 style={{marginTop: 0}}>{detalhes.series_title}</h2>
        
        <img 
          src={(detalhes.poster_link && detalhes.poster_link !== "N/A") ? detalhes.poster_link : "https://via.placeholder.com/300x450?text=Sem+Imagem"} alt={detalhes.series_title} className="modal-poster" 
        />
        
        <div className="modal-info">
            <p><strong>Ano:</strong> {detalhes.released_year}</p>
            <p><strong>Gênero:</strong> {detalhes.genre}</p>
            <p><strong>Nota IMDB:</strong> ⭐ {detalhes.imdb_rating}</p>
            <p><strong>Diretor:</strong> {detalhes.director}</p>
            <hr/>
            <p><strong>Sinopse:</strong></p>
            <p>{detalhes.overview}</p>
        </div>
      </div>
    </div>
  );
}

export default Modal;