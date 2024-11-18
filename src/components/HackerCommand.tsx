import { useState } from "react";
import { HackerTerminal } from "./HackerTerminal";

export function HackerCommand() {
    const [showTerminal, setShowTerminal] = useState(true);

    if (!showTerminal) return null;

    return <HackerTerminal onExit={() => setShowTerminal(false)} />;
}
