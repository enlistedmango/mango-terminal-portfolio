import { useEffect, useRef, useState } from "react";
import { highScores } from "../utils/highScores";

interface SnakeGameProps {
    onGameOver?: (score: number) => void;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export function SnakeGame({ onGameOver }: SnakeGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Position>({ x: 15, y: 15 });
    const [direction, setDirection] = useState<Direction>("RIGHT");
    const [showHighScores, setShowHighScores] = useState(false);
    const gameLoopRef = useRef<number | null>(null);

    const gridSize = 20;
    const tileSize = 20;
    const baseSpeed = 200; // Starting speed (slower)
    const minSpeed = 50; // Maximum speed (faster)

    // Calculate current speed based on score
    const getCurrentSpeed = (currentScore: number) => {
        const speedDecrease = Math.floor(currentScore * 10); // Decrease by 10ms per point
        return Math.max(minSpeed, baseSpeed - speedDecrease);
    };

    const generateFood = () => {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        setFood({ x, y });
    };

    const handleKeyPress = (e: KeyboardEvent) => {
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
        }
    };

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
            case "UP":
                head.y -= 1;
                break;
            case "DOWN":
                head.y += 1;
                break;
            case "LEFT":
                head.x -= 1;
                break;
            case "RIGHT":
                head.x += 1;
                break;
        }

        // Check for collisions
        if (
            head.x < 0 ||
            head.x >= gridSize ||
            head.y < 0 ||
            head.y >= gridSize ||
            snake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
            handleGameOver(score);
            return;
        }

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
            setScore((prev) => prev + 1);
            generateFood();
        } else {
            newSnake.pop();
        }

        newSnake.unshift(head);
        setSnake(newSnake);
    };

    const handleGameOver = (finalScore: number) => {
        setGameOver(true);
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
            gameLoopRef.current = null;
        }
        const isHigh = highScores.isHighScore(finalScore);
        if (isHigh) {
            highScores.add(finalScore);
            setShowHighScores(true);
        }
        onGameOver?.(finalScore);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw game
        const draw = () => {
            // Clear canvas
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw snake
            ctx.fillStyle = "#0F0";
            snake.forEach(({ x, y }) => {
                ctx.fillRect(x * tileSize, y * tileSize, tileSize - 2, tileSize - 2);
            });

            // Draw food
            ctx.fillStyle = "#F00";
            ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 2, tileSize - 2);

            // Draw score
            ctx.fillStyle = "#FFF";
            ctx.font = "20px monospace";
            ctx.fillText(`Score: ${score}`, 10, 30);

            // Draw current speed
            const currentSpeed = getCurrentSpeed(score);
            ctx.fillText(`Speed: ${Math.floor((1000 / currentSpeed) * 10) / 10}x`, 10, 60);
        };

        draw();
    }, [snake, food, score]);

    useEffect(() => {
        if (gameOver) return;

        const speed = getCurrentSpeed(score);
        gameLoopRef.current = window.setInterval(moveSnake, speed);

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
                gameLoopRef.current = null;
            }
        };
    }, [snake, direction, gameOver, score]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [direction]);

    return (
        <div className="snake-game">
            <canvas
                ref={canvasRef}
                width={gridSize * tileSize}
                height={gridSize * tileSize}
                style={{ border: "2px solid #333" }}
            />
            {(gameOver || showHighScores) && (
                <div className="game-over">
                    <h3>Game Over!</h3>
                    <p>Score: {score}</p>
                    <div className="high-scores">
                        <h4>High Scores</h4>
                        <ul>
                            {highScores.get().map((highScore, index) => (
                                <li key={index}>
                                    {highScore.score} - {highScore.date}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
