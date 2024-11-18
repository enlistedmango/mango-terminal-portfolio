import React from "react";
import { TypeWriter } from "./TypeWriter";

interface TerminalOutputProps {
    children: React.ReactNode;
}

export function TerminalOutput({ children }: TerminalOutputProps) {
    // If children is a string, use TypeWriter
    if (typeof children === "string") {
        return (
            <div className="terminal-output">
                <TypeWriter text={children} />
            </div>
        );
    }

    // Otherwise render as normal
    return <div className="terminal-output">{children}</div>;
}
