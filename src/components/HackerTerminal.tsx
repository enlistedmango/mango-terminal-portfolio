import React, { useState, useRef, useEffect } from "react";

interface HackerTerminalProps {
    onExit?: () => void;
}

interface TerminalHistory {
    command: string;
    output: React.ReactNode;
}

const HACKER_WELCOME = `
 _    _          _____ _  ________ _____  __  __          _   _ 
| |  | |   /\\   / ____| |/ /  ____|  __ \\|  \\/  |   /\\   | \\ | |
| |__| |  /  \\ | |    | ' /| |__  | |__) | \\  / |  /  \\  |  \\| |
|  __  | / /\\ \\| |    |  < |  __| |  _  /| |\\/| | / /\\ \\ | . \` |
| |  | |/ ____ \\ |____| . \\| |____| | \\ \\| |  | |/ ____ \\| |\\  |
|_|  |_/_/    \\_\\_____|_|\\_\\______|_|  \\_\\_|  |_/_/    \\_\\_| \\_|

Welcome to the Hackerman Challenge! Find the hidden commands by exploring the system.
Type 'help' to see available commands.
Type 'exit' to return to main terminal.
`;

// Available commands for tab completion
const AVAILABLE_COMMANDS = [
    "help",
    "ls",
    "cd",
    "cat",
    "pwd",
    "exit",
    "ls /home/visitor",
    "cat /home/visitor/.secret_note.txt",
    "ls /var/log/secrets",
    "cat /var/log/secrets/encoded_command.b64",
    "base64 -d /var/log/secrets/encoded_command.b64",
];

export function HackerTerminal({ onExit }: HackerTerminalProps) {
    const [history, setHistory] = useState<TerminalHistory[]>([
        { command: "", output: HACKER_WELCOME },
    ]);
    const [currentCommand, setCurrentCommand] = useState("");
    const terminalRef = useRef<HTMLDivElement>(null);

    const handleTabCompletion = (partialCommand: string) => {
        // If the command includes spaces, handle path completion
        if (partialCommand.includes(" ")) {
            const [cmd, ...args] = partialCommand.split(" ");
            const path = args.join(" ");

            // Handle directory-specific completions
            if (cmd === "ls" || cmd === "cat") {
                const pathCompletions = AVAILABLE_COMMANDS.filter(
                    (c) => c.startsWith(`${cmd} `) && c.includes(path)
                ).map((c) => c.split(" ").slice(1).join(" "));

                if (pathCompletions.length === 1) {
                    setCurrentCommand(`${cmd} ${pathCompletions[0]}`);
                } else if (pathCompletions.length > 1) {
                    setHistory((prev) => [
                        ...prev,
                        {
                            command: currentCommand,
                            output: (
                                <div className="completion-suggestions">
                                    <p>Possible completions:</p>
                                    {pathCompletions.map((p, i) => (
                                        <div
                                            key={i}
                                            className="suggestion">
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                    ]);
                }
                return;
            }
        }

        // Handle command completion
        const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(partialCommand));

        if (matches.length === 1) {
            setCurrentCommand(matches[0]);
        } else if (matches.length > 1) {
            // Find common prefix among matches
            const commonPrefix = matches.reduce((prefix, current) => {
                let i = 0;
                while (i < prefix.length && i < current.length && prefix[i] === current[i]) i++;
                return prefix.slice(0, i);
            });

            // If we have a longer common prefix, use it
            if (commonPrefix.length > partialCommand.length) {
                setCurrentCommand(commonPrefix);
            }

            // Show all possible completions
            setHistory((prev) => [
                ...prev,
                {
                    command: currentCommand,
                    output: (
                        <div className="completion-suggestions">
                            <p>Possible completions:</p>
                            <div className="suggestions-grid">
                                {matches.map((cmd, i) => (
                                    <div
                                        key={i}
                                        className="suggestion">
                                        {cmd}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
            ]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Tab") {
            e.preventDefault();
            handleTabCompletion(currentCommand);
        } else if (e.key === "Enter") {
            handleCommand(currentCommand);
        }
    };

    const handleCommand = async (command: string) => {
        const cmd = command.trim().toLowerCase();

        if (cmd === "exit") {
            onExit?.();
            return;
        }

        let output: React.ReactNode;
        switch (cmd) {
            case "help":
                output = (
                    <div className="help-content">
                        <p>Available Commands:</p>
                        <ul>
                            <li>ls - List directory contents</li>
                            <li>cd - Change directory</li>
                            <li>cat - Read file contents</li>
                            <li>pwd - Print working directory</li>
                            <li>exit - Exit hacker terminal</li>
                        </ul>
                    </div>
                );
                break;
            case "ls":
                output = (
                    <div className="directory-listing">
                        <p>drwxr-xr-x 2 hacker hacker 4096 Feb 20 12:34 .</p>
                        <p>drwxr-xr-x 47 hacker hacker 4096 Feb 20 12:34 ..</p>
                        <p>-rw-r--r-- 1 hacker hacker 220 Feb 20 12:34 .secret_file</p>
                        <p>-rw-r--r-- 1 hacker hacker 89 Feb 20 12:34 readme.txt</p>
                    </div>
                );
                break;
            case "cat readme.txt":
                output = (
                    <div className="file-content">
                        <p>Welcome to the hacker challenge!</p>
                        <p>
                            Your mission, should you choose to accept it, is to find the hidden
                            commands.
                        </p>
                        <p>First hint: Check the .secret_file</p>
                    </div>
                );
                break;
            case "cat .secret_file":
                output = (
                    <div className="file-content">
                        <p>Good job finding this file!</p>
                        <p>Next clue: Look in /var/log/secrets</p>
                    </div>
                );
                break;
            default:
                output = `Command not found: ${command}. Type 'help' for available commands.`;
        }

        setHistory((prev) => [...prev, { command, output }]);
        setCurrentCommand("");
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div className="hacker-terminal">
            <div className="terminal-header">
                <span>HACKER TERMINAL v1.0</span>
                <button
                    className="close-button"
                    onClick={onExit}>
                    ×
                </button>
            </div>
            <div
                className="terminal-content"
                ref={terminalRef}>
                {history.map((entry, index) => (
                    <div key={index}>
                        {entry.command && (
                            <div className="terminal-prompt">
                                <span className="prompt-symbol">hacker@system:~$</span>
                                <span className="command-text">{entry.command}</span>
                            </div>
                        )}
                        <div className="terminal-output">{entry.output}</div>
                    </div>
                ))}
                <div className="terminal-prompt">
                    <span className="prompt-symbol">hacker@system:~$</span>
                    <input
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}
