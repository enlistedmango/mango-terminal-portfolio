import { useEffect, useRef } from "react";

interface MatrixRainProps {
    duration?: number;
    onComplete?: () => void;
}

export function MatrixRain({ duration = 10000, onComplete }: MatrixRainProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const chars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ".split("");
        const columns = Math.floor(canvas.width / 20);
        const drops: number[] = new Array(columns).fill(1);

        // Store canvas and context in variables that are definitely not null
        const ctx = context;
        const cnv = canvas;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, cnv.width, cnv.height);

        let frameId: number;
        const startTime = Date.now();
        let lastDrawTime = startTime;

        function draw() {
            const currentTime = Date.now();
            const elapsed = currentTime - lastDrawTime;

            // Limit the frame rate to approximately 15 FPS
            if (elapsed > 66) {
                // 1000ms / 15fps ≈ 66ms
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, cnv.width, cnv.height);

                ctx.fillStyle = "#0F0";
                ctx.font = "15px monospace";

                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i * 20, drops[i] * 20);

                    if (drops[i] * 20 > cnv.height && Math.random() > 0.99) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }

                lastDrawTime = currentTime;
            }

            if (currentTime - startTime < duration) {
                frameId = requestAnimationFrame(draw);
            } else {
                onComplete?.();
            }
        }

        frameId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [duration, onComplete]);

    return (
        <div className="matrix-container">
            <canvas
                ref={canvasRef}
                className="matrix-canvas"
            />
        </div>
    );
}
