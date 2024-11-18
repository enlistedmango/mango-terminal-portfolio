import { useState } from "react";
import { AIChatBox } from "./AIChatBox";

export function AIChatCommand() {
    const [showChat, setShowChat] = useState(true);

    if (!showChat) return null;

    return (
        <div className="ai-chat-content">
            <AIChatBox onClose={() => setShowChat(false)} />
        </div>
    );
}
