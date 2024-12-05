import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SnakeGame from "./components/Snake.jsx";
import SudokuGame from "./components/Sudoku.jsx";
import "./styles/App.css";
import TetrisGame from "./components/Tetris.jsx";
import TicTacToe from "./components/TicTacToe.jsx";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/sudoku" element={<SudokuGame />} />
          <Route path="/tetris" element={<TetrisGame />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="home-container">
    <header className="home-header">
      <h1>Welcome to the Game Hub</h1>
      <p>Your gateway to fun and exciting games!</p>
    </header>
    <nav className="home-nav">
      <a href="/snake" className="home-link">
        🎮 Play Snake
      </a>
      <a href="/sudoku" className="home-link">
        🧩 Play Sudoku
      </a>
      <a href="/tetris" className="home-link">🕹️ Play Tetris</a>
      <a href="/tictactoe" className="home-link">❌⭕ Play Tic-Tac-Toe</a> 
    </nav>
    <footer className="home-footer">
      <p>Built with ❤️ for gaming enthusiasts</p>
    </footer>
  </div>
);

export default App;
