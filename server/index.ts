const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant for a developer's portfolio website. 
You have knowledge about the developer's background, skills, and projects.
Be friendly, professional, and concise in your responses.
You can help visitors learn more about the developer's:
- Work experience
- Technical skills
- Projects
- Education
- Contact information`;

// Weather API endpoint
app.get('/api/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;
        const BASE_URL = 'https://api.openweathermap.org/data/2.5';

        if (!API_KEY) {
            return res.status(500).json({ error: 'Weather API key not configured' });
        }

        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({ error: 'City not found' });
            }
            throw new Error('Weather data not available');
        }

        const data = await response.json();

        // Helper function to get weather ASCII art
        function getWeatherArt(condition) {
            const weatherArt = {
                Clear: `
   \\   /  
    .-.    
‒ (   ) ‒  
    \`-'    
   /   \\   `,
                Clouds: `
    .--.    
 .-(    ).  
(___.__)__) 
            `,
                Rain: `
     .-.    
    (   ).  
   (___(__)  
    ʻ ʻ ʻ ʻ  
   ʻ ʻ ʻ ʻ  `,
                Snow: `
     .-.    
    (   ).  
   (___(__)  
    *  *  *  
   *  *  *   `,
                Thunderstorm: `
     .-.    
    (   ).  
   (___(__)  
  ⚡ʻ ʻ⚡ʻ ʻ  
    ʻ ʻ ʻ   `,
                Default: `
    .-.    
   (   ).  
  (___(__)  `
            };
            return weatherArt[condition] || weatherArt.Default;
        }

        // Format the response
        const weatherData = {
            temp: Math.round(data.main.temp * 9 / 5 + 32), // Convert to Fahrenheit
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 2.237), // Convert to mph
            condition: data.weather[0].main,
            icon: getWeatherArt(data.weather[0].main),
            location: data.name
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to get weather data' });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...history,
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
