import React, { useState, useRef, useEffect } from "react";
import { executeCommand } from "../utils/commandExecutor";
import { TerminalPrompt } from "./TerminalPrompt";
import { TerminalOutput } from "./TerminalOutput";
import { commands } from "../utils/commands";

interface TerminalHistory {
    command: string;
    output: React.ReactNode;
}

const WELCOME_MESSAGE = `
██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝

Welcome to my terminal portfolio! Type 'help' to see available commands.
Type 'about' to learn more about me.

© ${new Date().getFullYear()} - Made with ❤️ using React & TypeScript
-----------------------------------------------------------------
`;

export function Terminal() {
    const [history, setHistory] = useState<TerminalHistory[]>([]);
    const [currentCommand, setCurrentCommand] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [audio] = useState(() => new Audio("/keypress.mp3"));

    // Show welcome message on mount
    useEffect(() => {
        setHistory([{ command: "", output: WELCOME_MESSAGE }]);
    }, []);

    const handleCommand = async (command: string) => {
        // Play sound effect
        audio.play().catch(() => {
            // Handle any audio playback errors silently
        });

        if (command.trim().toLowerCase() === "clear") {
            setHistory([]);
            setCurrentCommand("");
            return;
        }

        // Add command to history
        setCommandHistory((prev) => [...prev, command]);
        setHistoryIndex(-1);

        const output = await executeCommand(command.trim().toLowerCase());
        setHistory((prev) => [...prev, { command, output }]);
        setCurrentCommand("");
    };

    const handleKeyNavigation = (direction: "up" | "down") => {
        if (commandHistory.length === 0) return;

        if (direction === "up") {
            const newIndex =
                historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
            setHistoryIndex(newIndex);
            setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || "");
        } else {
            const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
            setHistoryIndex(newIndex);
            setCurrentCommand(
                newIndex === -1 ? "" : commandHistory[commandHistory.length - 1 - newIndex]
            );
        }
    };

    const handleTabCompletion = (partialCommand: string) => {
        // Get all available commands including hidden ones
        const availableCommands = [
            ...Object.keys(commands),
            "ls /home/visitor",
            "cat /home/visitor/.secret_note.txt",
            "ls /var/log/secrets",
            "cat /var/log/secrets/encoded_command.b64",
            "base64 -d /var/log/secrets/encoded_command.b64",
            "super_secret_command",
        ];

        // If the command includes spaces, handle path completion
        if (partialCommand.includes(" ")) {
            const [cmd, ...args] = partialCommand.split(" ");
            const path = args.join(" ");

            // Handle directory-specific completions
            if (cmd === "ls" || cmd === "cat") {
                const pathCompletions = availableCommands
                    .filter((c) => c.startsWith(`${cmd} `) && c.includes(path))
                    .map((c) => c.split(" ").slice(1).join(" "));

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
        const matches = availableCommands.filter((cmd) => cmd.startsWith(partialCommand));

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

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div className="terminal-container">
            <div className="terminal-header">
                <div className="window-controls">
                    <div className="window-control control-close"></div>
                    <div className="window-control control-minimize"></div>
                    <div className="window-control control-maximize"></div>
                </div>
            </div>
            <div
                className="terminal-content"
                ref={terminalRef}
                onClick={() => document.querySelector("input")?.focus()}>
                {history.map((entry, index) => (
                    <div key={index}>
                        {entry.command && (
                            <TerminalPrompt
                                command={entry.command}
                                readOnly
                            />
                        )}
                        <TerminalOutput>{entry.output}</TerminalOutput>
                    </div>
                ))}
                <TerminalPrompt
                    command={currentCommand}
                    onChange={setCurrentCommand}
                    onSubmit={handleCommand}
                    onKeyNavigation={handleKeyNavigation}
                    onTabCompletion={handleTabCompletion}
                />
            </div>
        </div>
    );
}