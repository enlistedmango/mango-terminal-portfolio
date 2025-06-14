import React from "react";
import { MatrixRain } from "../components/MatrixRain";
import { SnakeGame } from "../components/SnakeGame";
import { AIChatCommand } from "../components/AIChatCommand";
import { getWeather } from "../services/weatherService";
import { HackerCommand } from "../components/HackerCommand";

type CommandFunction = (args: string[]) => Promise<React.ReactNode> | React.ReactNode;

interface CommandsMap {
    [key: string]: CommandFunction;
}

export const commands: CommandsMap = {
    help: () => (
        <div className="help-content">
            <h3>Available Commands:</h3>
            <ul>
                <li>
                    <strong>about</strong> - Learn about me
                </li>
                <li>
                    <strong>projects</strong> - View my projects
                </li>
                <li>
                    <strong>contact</strong> - Get my contact information
                </li>
                <li>
                    <strong>skills</strong> - See my technical skills
                </li>
                <li>
                    <strong>clear</strong> - Clear the terminal
                </li>
                <li>
                    <strong>help</strong> - Show this help message
                </li>
            </ul>
            <p>Tip: Try to find hidden commands! 🕵️‍♂️</p>
        </div>
    ),

    about: () => (
        <div className="about-content">
            <h3>About Me</h3>
            <p>
                I am a passionate software developer with expertise in web development and a love
                for creating innovative solutions.
            </p>
            <p>
                My journey in tech began with a curiosity about how things work, and that curiosity
                continues to drive me forward.
            </p>
        </div>
    ),

    projects: () => (
        <div className="projects-content">
            <h3>My Projects</h3>
            <ul>
                <li>
                    <strong>Project 1</strong> - Description of project 1
                </li>
                <li>
                    <strong>Project 2</strong> - Description of project 2
                </li>
                <li>
                    <strong>Project 3</strong> - Description of project 3
                </li>
            </ul>
        </div>
    ),

    contact: () => (
        <div className="contact-content">
            <h3>Contact Information</h3>
            <ul>
                <li>📧 Email: jamiemccallum0@gmail.com</li>
                <li>🔗 LinkedIn: linkedin.com/in/jamiemccallum1</li>
                <li>🐙 GitHub: github.com/enlistedmango</li>
            </ul>
        </div>
    ),

    skills: () => (
        <div className="skills-content">
            <h3>Technical Skills</h3>
            <ul>
                <li>💻 Languages: JavaScript, TypeScript, Python, Go</li>
                <li>⚛️ Frontend: React, HTML5, CSS3</li>
                <li>🔙 Backend: Go, NestJS</li>
                <li>🗄️ Databases: PostgreSQL</li>
                <li>🛠️ Tools: Git, Docker, AWS</li>
            </ul>
        </div>
    ),

    clear: () => null,

    // Easter egg commands
    sudo: () => "🚫 Nice try! But you don't have root privileges here 😉",
    ls: () => "What are you looking for? 👀",
    vim: () => "Trying to exit vim? Not this time! 😄",
    matrix: () => (
        <div className="matrix-content">
            <MatrixRain
                duration={10000}
                onComplete={() => console.log("Matrix animation completed")}
            />
            <p style={{ color: "#0F0", marginTop: "10px", textAlign: "center" }}>Wake up, Neo...</p>
        </div>
    ),
    coffee: () => "Here's your virtual coffee! ☕",
    whoami: () => "You tell me! 🤔",
    snake: () => (
        <div className="snake-content">
            <p style={{ color: "#0F0", marginBottom: "10px", textAlign: "center" }}>
                🐍 Snake Game! Use arrow keys to control the snake.
            </p>
            <SnakeGame onGameOver={(score) => console.log(`Game Over! Score: ${score}`)} />
        </div>
    ),
    ai: () => <AIChatCommand />,
    weather: async (args: string[]) => {
        try {
            if (args.length === 0) {
                return (
                    <div className="weather-content">
                        <p>Please specify a city:</p>
                        <p style={{ color: "#a9dc76" }}>Usage: weather [city name]</p>
                        <p>Examples:</p>
                        <ul>
                            <li>weather London</li>
                            <li>weather New York</li>
                            <li>weather Tokyo</li>
                        </ul>
                    </div>
                );
            }

            const city = args.join(" ");
            const weather = await getWeather(city);

            return (
                <div className="weather-content">
                    <pre style={{ color: "#a9dc76", marginBottom: "10px" }}>{weather.icon}</pre>
                    <div style={{ color: "#fcfcfa" }}>
                        <p>📍 {weather.location}</p>
                        <p>
                            🌡️ Temperature: {weather.temp}°F /{" "}
                            {Math.round(((weather.temp - 32) * 5) / 9)}°C
                        </p>
                        <p>🌤️ Condition: {weather.condition}</p>
                        <p>💨 Wind: {weather.windSpeed} mph</p>
                        <p>💧 Humidity: {weather.humidity}%</p>
                    </div>
                </div>
            );
        } catch (error) {
            return (
                <div className="weather-content error">
                    <p>❌ Sorry, couldn't fetch weather data for that location.</p>
                    <p>Please check the city name and try again.</p>
                    <p>Example: weather London</p>
                </div>
            );
        }
    },

    hackerman: () => <HackerCommand />,

    "man hackerman": () => (
        <div className="manual-content">
            <h3>HACKERMAN(1) User Commands HACKERMAN(1)</h3>
            <p>Find hidden commands by exploring the system. Use common Linux commands:</p>
            <ul>
                <li>ls - List directory contents</li>
                <li>cd - Change directory</li>
                <li>cat - Read file contents</li>
                <li>pwd - Print working directory</li>
            </ul>
            <p>Start by typing: ls /home/visitor</p>
        </div>
    ),

    "ls /home/visitor": () => (
        <div className="directory-listing">
            <p>drwxr-xr-x 2 visitor visitor 4096 Feb 20 12:34 .</p>
            <p>drwxr-xr-x 47 visitor visitor 4096 Feb 20 12:34 ..</p>
            <p>-rw-r--r-- 1 visitor visitor 220 Feb 20 12:34 .bash_history</p>
            <p>-rw-r--r-- 1 visitor visitor 89 Feb 20 12:34 .secret_note.txt</p>
        </div>
    ),

    "cat /home/visitor/.secret_note.txt": () => (
        <div className="file-content">
            <p>I keep all my secrets in /var/log/secrets...</p>
            <p>But you'll need to decode them. Here's a hint: base64 -d</p>
        </div>
    ),

    "ls /var/log/secrets": () => (
        <div className="directory-listing">
            <p>-rw-r--r-- 1 root root 128 Feb 20 12:34 encoded_command.b64</p>
        </div>
    ),

    "cat /var/log/secrets/encoded_command.b64": () => (
        <div className="file-content">
            <p>c3VwZXJfc2VjcmV0X2NvbW1hbmQ=</p>
            <p>Hint: Try to decode this...</p>
        </div>
    ),

    "base64 -d /var/log/secrets/encoded_command.b64": () => (
        <div className="file-content">
            <p>Decoded command: super_secret_command</p>
            <p>Try running it!</p>
        </div>
    ),

    super_secret_command: () => (
        <div className="secret-content">
            <pre style={{ color: "#0F0" }}>
                {`
🎉 Congratulations! You've found a secret command!
Here are some more hidden commands you've unlocked:
- matrix
- snake
- coffee
- whoami

Keep exploring, there might be more secrets...
                `}
            </pre>
        </div>
    ),

    // Add more puzzle-related commands...
};
