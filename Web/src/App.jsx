import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import './styles/global.css';

function App() {
  return (
    <div>
      <Header/>
      <Home/>
      <Footer />
    </div>
  );
}

export default App;