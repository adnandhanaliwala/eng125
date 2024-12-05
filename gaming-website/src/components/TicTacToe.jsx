import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TicTacToe.css';

const TicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const handleClick = (i) => {
    const boardCopy = [...board];

    // If game is won or square is already filled, return
    if (winner || boardCopy[i]) return;

    // Put X or O on the clicked square
    boardCopy[i] = xIsNext ? 'X' : 'O';
    
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  useEffect(() => {
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
    } else if (!board.includes(null)) {
      setWinner('draw');
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const goToHome = () => {
    navigate('/');
  };

  const renderSquare = (i) => (
    <button 
      className="square" 
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  let status;
  if (winner && winner !== 'draw') {
    status = `Winner: ${winner}`;
  } else if (winner === 'draw') {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="tic-tac-toe">
      <div className="game-header">
        <h1>Tic Tac Toe</h1>
        <div className="game-controls">
          <button onClick={resetGame}>New Game</button>
          <button onClick={goToHome}>Back to Home</button>
        </div>
      </div>
      <div className="status">{status}</div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      {(winner) && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>{winner === 'draw' ? "It's a Draw!" : `${winner} Wins!`}</h2>
            <div className="game-over-buttons">
              <button onClick={resetGame}>Play Again</button>
              <button onClick={goToHome}>Back to Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;