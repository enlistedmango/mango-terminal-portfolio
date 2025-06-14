import React from "react";

interface TerminalPromptProps {
    command: string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    onSubmit?: (command: string) => void;
    onKeyNavigation?: (direction: "up" | "down") => void;
    onTabCompletion?: (partialCommand: string) => void;
}

export function TerminalPrompt({
    command,
    readOnly = false,
    onChange,
    onSubmit,
    onKeyNavigation,
    onTabCompletion,
}: TerminalPromptProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (readOnly) return;

        switch (e.key) {
            case "Enter":
                onSubmit?.(command);
                break;
            case "ArrowUp":
                e.preventDefault();
                onKeyNavigation?.("up");
                break;
            case "ArrowDown":
                e.preventDefault();
                onKeyNavigation?.("down");
                break;
            case "Tab":
                e.preventDefault();
                onTabCompletion?.(command);
                break;
        }
    };

    return (
        <div className="terminal-prompt">
            <span className="prompt-symbol">visitor@portfolio:~$</span>
            {readOnly ? (
                <span className="command-text">{command}</span>
            ) : (
                <input
                    type="text"
                    value={command}
                    onChange={(e) => onChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                />
            )}
        </div>
    );
}
