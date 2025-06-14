# Tests Directory

This directory contains test files for the terminal portfolio project.

## Available Tests

### Weather API Integration Test
- **File**: `weather-api.test.js`
- **Purpose**: Tests the secure weather API backend endpoint
- **Run**: `node tests/weather-api.test.js`
- **Requirements**: 
  - Backend server running (`npm run server`)
  - `WEATHER_API_KEY` configured in `.env`
  - Internet connection

### Running Tests

```bash
# Make sure backend server is running first
npm run server

# In another terminal, run the weather API test
node tests/weather-api.test.js
```

## Test Structure

- Integration tests for API endpoints
- Error handling validation
- Response structure validation
- Multiple test cases per endpoint

## Future Tests

Consider adding:
- Unit tests for individual components
- E2E tests for terminal commands
- Performance tests for API responses
- Security tests for API endpoints 