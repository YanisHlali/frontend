import React from 'react';
import './App.css';
import MovieSearch from './components/MovieSearch';
import Auth from './components/Auth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CineMatch</h1>
      </header>
      <Auth />
      <MovieSearch />
    </div>
  );
}

export default App;
