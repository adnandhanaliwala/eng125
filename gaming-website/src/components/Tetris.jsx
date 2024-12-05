import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Tetris.css';
import { useNavigate } from 'react-router-dom';

// Tetromino shapes and colors remain the same as in previous implementation
const SHAPES = [
  // I shape
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // Square shape
  [
    [1, 1],
    [1, 1]
  ],
  // T shape
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // L shape
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // Reverse L shape
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // S shape
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  // Z shape
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
];

const COLORS = [
  '#FF0D72',  // Pink
  '#0DC2FF',  // Blue
  '#0DFF72',  // Green
  '#F538FF',  // Magenta
  '#FF8E0D',  // Orange
  '#FFE138',  // Yellow
  '#3877FF'   // Deep Blue
];

const Tetris = () => {

const navigate = useNavigate();
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const [board, setBoard] = useState(   
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getRandomPiece = () => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: COLORS[shapeIndex]
    };
  };

  const isValidMove = useCallback((piece, offsetX, offsetY, boardState = board, positionState = currentPosition) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = positionState.x + x + offsetX;
          const newY = positionState.y + y + offsetY;

          if (
            newX < 0 || 
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && boardState[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board, currentPosition, BOARD_WIDTH, BOARD_HEIGHT]);

  const mergePiece = useCallback(() => {
    const newBoard = [...board];
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = currentPosition.y + y;
          const boardX = currentPosition.x + x;
          
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });

    const clearedBoard = newBoard.filter(row => !row.every(cell => cell !== 0));
    const linesToClear = BOARD_HEIGHT - clearedBoard.length;
    
    const newEmptyRows = Array(linesToClear)
      .fill()
      .map(() => Array(BOARD_WIDTH).fill(0));
    
    const updatedBoard = [...newEmptyRows, ...clearedBoard];
    
    setScore(prev => prev + (linesToClear * 100));
    
    setBoard(updatedBoard);
    
    const newPiece = getRandomPiece();
    const startX = Math.floor(BOARD_WIDTH / 2) - 1;
    const startY = 0;

    if (!isValidMove(newPiece, 0, 0, updatedBoard, { x: startX, y: startY })) {
      setIsGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setCurrentPosition({ x: startX, y: startY });
    }
  }, [board, currentPiece, currentPosition, isValidMove, BOARD_WIDTH, BOARD_HEIGHT]);

  const movePiece = useCallback((offsetX, offsetY) => {
    if (isValidMove(currentPiece, offsetX, offsetY)) {
      setCurrentPosition(prev => ({
        x: prev.x + offsetX,
        y: prev.y + offsetY
      }));
    } else if (offsetY > 0) {
      mergePiece();
    }
  }, [currentPiece, isValidMove, mergePiece]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece) return;

    const rotated = currentPiece.shape[0].map((_, index) => 
      currentPiece.shape.map(row => row[index]).reverse()
    );

    const newPiece = { ...currentPiece, shape: rotated };
    
    if (isValidMove(newPiece, 0, 0)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, isValidMove]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      movePiece(0, 1);
    }, 500);

    return () => clearInterval(gameLoop);
  }, [movePiece, isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver) return;

    const handleKeyDown = (e) => {
      if (isPaused) return;

      switch(e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, isGameOver, isPaused]);

  const startNewGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    const newPiece = getRandomPiece();
    setCurrentPiece(newPiece);
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const renderBoard = () => {
    const boardWithPiece = board.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && 
                boardX >= 0 && boardX < BOARD_WIDTH) {
              boardWithPiece[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return boardWithPiece;
  };

  useEffect(() => {
    if (!currentPiece) {
      const newPiece = getRandomPiece();
      setCurrentPiece(newPiece);
      setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    }
  }, [currentPiece]);


  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="tetris-container">
      <div className="tetris-game">
        <div className="game-header">
          <h1>Tetris</h1>
          <div className="game-controls">
            <span className="score">Score: {score}</span>
            <button onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={startNewGame}>New Game</button>
          </div>
        </div>
        <div className="game-board">
          {renderBoard().map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${x}-${y}`}
                className="game-cell"
                style={{ 
                  backgroundColor: cell || 'transparent',
                  borderColor: cell ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }}
              />
            ))
          )}
        </div>
        {isGameOver && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>Game Over</h2>
              <p>Your Score: {score}</p>
              <div className="game-over-buttons">
                <button onClick={startNewGame}>Play Again</button>
                <button onClick={goToHome}>Back to Home</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="game-controls-info">
        <p>Controls:</p>
        <p>← → Move | ↑ Rotate | ↓ Drop</p>
      </div>
    </div>
  );
};

export default Tetris;