import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  const directionRef = useRef(direction);
  
  // Update ref when state changes to prevent rapid multiple key presses causing self-collision
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) {
      if (e.key === 'Enter') resetGame();
      return;
    }

    if (e.key === 'p' || e.key === 'Escape') {
      setIsPaused(prev => !prev);
      return;
    }

    if (isPaused) return;

    const { x: dx, y: dy } = directionRef.current;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (dy !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (dy !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (dx !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (dx !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [isGameOver, isPaused, generateFood]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[400px] px-2 font-mono">
        <div className="bg-black/50 px-4 py-2 rounded-lg border border-[#ff007f] shadow-[0_0_10px_rgba(255,0,127,0.3)]">
          <span className="text-gray-400 text-sm">SCORE</span>
          <div className="text-2xl neon-text-pink leading-none mt-1">{score}</div>
        </div>
        
        <div className="bg-black/50 px-4 py-2 rounded-lg border border-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.3)]">
          <span className="text-gray-400 text-sm">HIGH SCORE</span>
          <div className="text-2xl neon-text-green leading-none mt-1">{highScore}</div>
        </div>
      </div>

      <div 
        className="relative bg-black/80 rounded-lg overflow-hidden neon-border-pink"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Draw Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute bg-[#39ff14] rounded-sm transition-all duration-[50ms]"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                boxShadow: isHead ? '0 0 10px #39ff14' : 'none',
                opacity: isHead ? 1 : 0.8 - (index * 0.02),
              }}
            />
          );
        })}

        {/* Draw Food */}
        <div
          className="absolute bg-[#ff007f] rounded-full animate-pulse transition-all duration-[50ms]"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            boxShadow: '0 0 15px #ff007f, 0 0 5px #ff007f inset',
          }}
        />

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
            <h2 className="text-4xl font-bold neon-text-pink mb-2">GAME OVER</h2>
            <p className="text-gray-300 mb-6 font-mono">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-transparent border-2 border-[#39ff14] text-[#39ff14] rounded-md font-bold hover:bg-[#39ff14] hover:text-black transition-all hover:shadow-[0_0_20px_#39ff14]"
            >
              PLAY AGAIN
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm z-10 gap-4">
            <h2 className="text-3xl font-bold text-white tracking-widest">PAUSED</h2>
            <button 
              onClick={() => setIsPaused(false)}
              className="px-6 py-2 bg-transparent border-2 border-[#00f3ff] text-[#00f3ff] rounded-md font-bold hover:bg-[#00f3ff] hover:text-black transition-all hover:shadow-[0_0_20px_#00f3ff]"
            >
              RESUME
            </button>
          </div>
        )}
      </div>

      <div className="text-gray-500 font-mono text-sm max-w-[400px] text-center mt-2">
        Use <span className="text-[#39ff14]">WASD</span> or <span className="text-[#39ff14]">Arrow Keys</span> to move. Press <span className="text-[#00f3ff]">P</span> to pause.
      </div>
    </div>
  );
}
