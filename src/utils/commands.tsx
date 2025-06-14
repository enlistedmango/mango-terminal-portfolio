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
            <h3>About Jamie McCallum</h3>
            <p>
                👋 Hi! I'm Jamie, a passionate software developer who loves building innovative 
                web applications and exploring cutting-edge technologies. My expertise spans 
                full-stack development with a particular focus on creating performant, 
                user-friendly applications.
            </p>
            <p>
                🚀 My journey in tech began with curiosity about how digital systems work, 
                which quickly evolved into a passion for problem-solving through code. 
                I enjoy working with modern technologies like React, TypeScript, and Go, 
                and I'm always eager to learn new tools that can make development more 
                efficient and enjoyable.
            </p>
            <p>
                💡 I believe in writing clean, maintainable code and creating solutions 
                that make a real difference. When I'm not coding, you can find me 
                exploring new technologies, contributing to open source, or working on 
                creative projects that push the boundaries of what's possible.
            </p>
            <p>
                📈 I'm currently focused on building scalable web applications and 
                exploring the intersection of AI and web development. This terminal 
                portfolio itself is an example of my love for creating unique, 
                interactive experiences!
            </p>
        </div>
    ),

    projects: () => (
        <div className="projects-content">
            <h3>Featured Projects</h3>
            <div className="project-item">
                <h4>🖥️ Terminal Portfolio</h4>
                <p>An interactive terminal-style portfolio built with React and TypeScript. 
                Features include AI chat integration, weather data, retro games, and hidden easter eggs. 
                Showcases modern web development with a nostalgic terminal aesthetic.</p>
                <p><strong>Tech:</strong> React, TypeScript, Express.js, OpenAI API, Vite</p>
                <p><strong>GitHub:</strong> <a href="https://github.com/enlistedmango/mango-terminal-portfolio" target="_blank" rel="noopener noreferrer">
                    github.com/enlistedmango/mango-terminal-portfolio
                </a></p>
            </div>
            
            <div className="project-item">
                <h4>🚀 [Your Project Name]</h4>
                <p>Description of your project - what it does, what problem it solves, 
                what makes it interesting or unique.</p>
                <p><strong>Tech:</strong> Your tech stack used</p>
                <p><strong>Link:</strong> Your project link or GitHub repo</p>
            </div>
            
            <div className="project-item">
                <h4>⚡ [Another Project Name]</h4>
                <p>Another project description - highlight the key features, 
                your role, and any notable achievements or challenges overcome.</p>
                <p><strong>Tech:</strong> Technologies used</p>
                <p><strong>Link:</strong> Project link or repository</p>
            </div>
            
            <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#a9dc76' }}>
                💡 Want to see more? Check out my GitHub profile for additional projects and contributions!
            </p>
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
