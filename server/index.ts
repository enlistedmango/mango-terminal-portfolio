const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Your AI context/prompt
const SYSTEM_PROMPT = `You are an AI assistant for a developer's portfolio website. 
You have knowledge about the developer's background, skills, and projects.
Be friendly, professional, and concise in your responses.
You can help visitors learn more about the developer's:
- Work experience
- Technical skills
- Projects
- Education
- Contact information`;

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
