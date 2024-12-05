import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div>
      <h1>Welcome to the Gaming Website</h1>
      <nav>
        <ul>
          <li><Link to="/sudoku">Play Sudoku</Link></li>
          <li><Link to="/snake">Play Snake</Link></li>
          <li><Link to="/tictactoe">Play Tic-Tac-Toe</Link></li>
          <li><Link to="/tetris">Play Tetris</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Welcome;