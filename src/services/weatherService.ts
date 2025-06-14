const API_URL = import.meta.env.VITE_API_URL;

interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    location: string;
}

export async function getWeather(city: string = 'London'): Promise<WeatherData> {
    try {
        const response = await fetch(`${API_URL}/api/weather/${encodeURIComponent(city)}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            }
            if (response.status === 500) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Weather service unavailable');
            }
            throw new Error('Weather data not available');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Weather fetch error:', error);
        throw error;
    }
}


