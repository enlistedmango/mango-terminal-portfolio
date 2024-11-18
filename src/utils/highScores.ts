interface HighScore {
    score: number;
    date: string;
}

const HIGH_SCORES_KEY = 'snake-high-scores';
const MAX_SCORES = 5;

export const highScores = {
    get: (): HighScore[] => {
        const scores = localStorage.getItem(HIGH_SCORES_KEY);
        return scores ? JSON.parse(scores) : [];
    },

    add: (score: number): HighScore[] => {
        const scores = highScores.get();
        const newScore: HighScore = {
            score,
            date: new Date().toLocaleDateString()
        };

        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, MAX_SCORES);

        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
        return topScores;
    },

    isHighScore: (score: number): boolean => {
        const scores = highScores.get();
        return scores.length < MAX_SCORES || score > Math.min(...scores.map(s => s.score));
    }
}; 
