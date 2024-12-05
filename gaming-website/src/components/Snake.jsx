import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Snake.css";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const Snake = () => {

const navigate = useNavigate();
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState(generateFoodPosition());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Generate random food position
  function generateFoodPosition() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }

  const goToHome = () => {
    navigate('/');
  };

  // Check if food is eaten
  const checkFoodEaten = useCallback(() => {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      setScore((prevScore) => prevScore + 10);
      // Create new food
      setFood(generateFoodPosition());
      // Grow snake
      const tail = snake[snake.length - 1];
      setSnake((prevSnake) => [...prevSnake, tail]);
      // Increase speed slightly
      setSpeed((prevSpeed) => Math.max(50, prevSpeed - 10));
      return true;
    }
    return false;
  }, [snake, food]);

  // Move snake
  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
  
    // Move head based on direction
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }
  
    // Check for wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }
  
    // Check for self-collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        setIsGameOver(true);
        return;
      }
    }
  
    // Add new head
    newSnake.unshift(head);
  
    // Remove tail if food not eaten
    if (!checkFoodEaten()) {
      newSnake.pop();
    }
  
    setSnake(newSnake);
  }, [direction, snake, checkFoodEaten]);
  

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (isGameOver) return;

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, speed, isGameOver]);

  // Reset game
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setFood(generateFoodPosition());
    setDirection("RIGHT");
    setScore(0);
    setSpeed(200);
    setIsGameOver(false);
  };

  return (
    <div className="snake-game">
      <div className="game-header">
        <h1>Snake Game</h1>
        <div className="game-info">
          <span>Score: {score}</span>
          <button onClick={goToHome}>Back to Home</button>
        </div>
      </div>

      <div
        className="game-board"
        style={{
          width: `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`,
        }}
      >
        {/* Snake body */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              width: `${CELL_SIZE}px`,
              height: `${CELL_SIZE}px`,
              backgroundColor: index === 0 ? "#00f" : "#0af",
            }}
          />
        ))}

        {/* Food */}
        <div
          className="food"
          style={{
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
          }}
        />
      </div>

      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <p>Your Score: {score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}

      <div className="game-controls">
        <p>Use Arrow Keys to Control Snake</p>
      </div>
    </div>
  );
};

export default Snake;
