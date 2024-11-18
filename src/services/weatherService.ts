const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    location: string;
}

interface WeatherArt {
    Clear: string;
    Clouds: string;
    Rain: string;
    Snow: string;
    Thunderstorm: string;
    Default: string;
    [key: string]: string;  // Index signature for any string key
}

export async function getWeather(city: string = 'London'): Promise<WeatherData> {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Weather data not available');
        }

        const data = await response.json();

        return {
            temp: Math.round(data.main.temp * 9 / 5 + 32), // Convert to Fahrenheit
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 2.237), // Convert to mph
            condition: data.weather[0].main,
            icon: getWeatherArt(data.weather[0].main),
            location: data.name
        };
    } catch (error) {
        console.error('Weather fetch error:', error);
        throw error;
    }
}

function getWeatherArt(condition: string): string {
    const weatherArt: WeatherArt = {
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
