import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/SudokuGame.css';

const initialBoard = [
  [5, 3, '', '', 7, '', '', '', ''],
  [6, '', '', 1, 9, 5, '', '', ''],
  ['', 9, 8, '', '', '', '', 6, ''],
  [8, '', '', '', 6, '', '', '', 3],
  [4, '', '', 8, '', 3, '', '', 1],
  [7, '', '', '', 2, '', '', '', 6],
  ['', 6, '', '', '', '', 2, 8, ''],
  ['', '', '', 4, 1, 9, '', '', 5],
  ['', '', '', '', 8, '', '', 7, 9],
];

const SudokuGame = () => {
  const [board, setBoard] = useState(() => JSON.parse(JSON.stringify(initialBoard))); // Deep copy
  const [message, setMessage] = useState('');

  const handleInputChange = (row, col, value) => {
    if (value === '' || (/^[1-9]$/.test(value) && !isNaN(value))) {
      const updatedBoard = JSON.parse(JSON.stringify(board)); // Deep copy before change
      updatedBoard[row][col] = value ? parseInt(value) : '';
      setBoard(updatedBoard);
      setMessage('');
    }
  };

  const isBoardValid = () => {
    const isValidRow = (row) => {
      const seen = new Set();
      for (const num of row) {
        if (num !== '' && seen.has(num)) return false;
        if (num !== '') seen.add(num);
      }
      return true;
    };

    const isValidColumn = (colIndex) => {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const num = board[row][colIndex];
        if (num !== '' && seen.has(num)) return false;
        if (num !== '') seen.add(num);
      }
      return true;
    };

    const isValidSubGrid = (startRow, startCol) => {
      const seen = new Set();
      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          const num = board[row][col];
          if (num !== '' && seen.has(num)) return false;
          if (num !== '') seen.add(num);
        }
      }
      return true;
    };

    for (let i = 0; i < 9; i++) {
      if (!isValidRow(board[i]) || !isValidColumn(i)) return false;
    }

    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        if (!isValidSubGrid(row, col)) return false;
      }
    }

    return true;
  };

  const handleValidate = () => {
    if (isBoardValid()) {
      setMessage('Congratulations! The board is valid.');
    } else {
      setMessage('Oops! The board has errors.');
    }
  };

  const handleReset = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard))); // Deep copy
    setMessage('');
  };

  return (
    <div className="sudoku-container">
      <header className="sudoku-header">
        <h1>Sudoku</h1>
        <Link to="/" className="home-link">
          Back to Home
        </Link>
        <button onClick={handleReset} className="reset-button">
          Reset Board
        </button>
      </header>
      <div className="sudoku-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cell}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                className={`sudoku-cell ${
                  initialBoard[rowIndex][colIndex] !== '' ? 'preset-cell' : ''
                }`}
                maxLength="1"
                readOnly={initialBoard[rowIndex][colIndex] !== ''}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="sudoku-controls">
        <button onClick={handleValidate} className="validate-button">
          Validate
        </button>
        {message && <p className="sudoku-message">{message}</p>}
      </div>
    </div>
  );
};

export default SudokuGame;
