import React from 'react';

function MovieCard({filme, aoClicar}) {
    return (
        <div
            className="card-filme" onClick={aoClicar}
        >
            <div className="container-imagem">
                <img 
                    src={(filme.poster_link && filme.poster_link !== "N/A") ? filme.poster_link : "https://via.placeholder.com/300x450?text=Sem+Imagem"} alt={`Poster do filme ${filme.series_title}`} className="card-imagem" 
                />
            </div>
            
            <div className="card-info">
                <h3 className="card-titulo">{filme.series_title}</h3>
                
                <div className="card-meta">
                    <p className="card-ano">{filme.released_year}</p>
                    <p className="card-nota">★ {filme.imdb_rating}</p>
                </div>
                
                <p className="card-genero">{filme.genre}</p>
            </div>
        </div>
    );
}

export default MovieCard;