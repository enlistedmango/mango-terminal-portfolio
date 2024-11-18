import { useState, useEffect } from "react";

interface TypeWriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export function TypeWriter({ text, speed = 30, onComplete }: TypeWriterProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return <span>{displayedText}</span>;
}
