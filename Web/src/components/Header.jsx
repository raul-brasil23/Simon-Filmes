import React from 'react';

function Header() {
  const recarregarPagina = () => {
    window.location.reload();
  };

  return (
    <header>
      <div className="container header-content">
        <div className="logo" onClick={recarregarPagina} title="Voltar ao início">
          Simon Filmes
        </div>
      </div>
    </header>
  );
}

export default Header;