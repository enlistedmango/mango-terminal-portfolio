/**
 * Weather API Backend Integration Test
 * Tests the secure weather API endpoint that hides the API key on the backend
 * 
 * Usage: node tests/weather-api.test.js
 * Requirements: Backend server running with WEATHER_API_KEY configured
 */

console.log('🌤️  Testing Weather API Backend Integration...\n');

// Test the new secure backend endpoint
async function testWeatherAPI() {
    const baseUrl = 'http://localhost:3000';
    const testCities = ['London', 'New York', 'Tokyo'];
    
    console.log('🔍 Testing weather API endpoint security and functionality...\n');
    
    for (const city of testCities) {
        console.log(`📍 Testing ${city}...`);
        
        try {
            const response = await fetch(`${baseUrl}/api/weather/${encodeURIComponent(city)}`);
            
            if (!response.ok) {
                console.log(`❌ API Response Error for ${city}: ${response.status} ${response.statusText}`);
                const errorData = await response.json();
                console.log('Error details:', errorData);
                continue;
            }

            const data = await response.json();
            
            // Validate response structure
            const requiredFields = ['temp', 'humidity', 'windSpeed', 'condition', 'icon', 'location'];
            const missingFields = requiredFields.filter(field => !(field in data));
            
            if (missingFields.length > 0) {
                console.log(`❌ Missing required fields for ${city}:`, missingFields);
                continue;
            }
            
            console.log(`✅ ${city} - Success!`);
            console.log(`   🌡️  Temperature: ${data.temp}°F`);
            console.log(`   🌤️  Condition: ${data.condition}`);
            console.log(`   💨 Wind: ${data.windSpeed} mph`);
            console.log(`   💧 Humidity: ${data.humidity}%`);
            console.log(`   📍 Location: ${data.location}`);
            console.log(`   🎨 Has weather art: ${data.icon ? 'Yes' : 'No'}`);
            console.log('');
            
        } catch (error) {
            console.error(`❌ Network Error for ${city}:`, error.message);
        }
    }
    
    // Test error handling
    console.log('🔍 Testing error handling...');
    
    try {
        const response = await fetch(`${baseUrl}/api/weather/InvalidCityName123456`);
        if (response.status === 404) {
            console.log('✅ Error handling - 404 for invalid city works correctly');
        } else {
            console.log('⚠️  Unexpected response for invalid city:', response.status);
        }
    } catch (error) {
        console.error('❌ Error handling test failed:', error.message);
    }
}

// Test runner
async function runTests() {
    try {
        await testWeatherAPI();
        console.log('\n🎉 Weather API tests completed!');
        console.log('\n💡 If tests failed, make sure:');
        console.log('   1. Backend server is running: npm run server');
        console.log('   2. WEATHER_API_KEY is set in .env file');
        console.log('   3. Weather API key is valid and has remaining quota');
        console.log('   4. Internet connection is available');
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

runTests(); 