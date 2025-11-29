import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Get comprehensive weather data
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude
 *     responses:
 *       200:
 *         description: Complete weather data with forecast
 */
router.get('/', async (req, res): Promise<void> => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
      return;
    }

    // Fetch real weather data from Open-Meteo API (free, no API key required)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherApiData: any = await weatherResponse.json();
    
    // Helper function to convert weather code to condition and icon
    const getWeatherCondition = (code: number) => {
      // WMO Weather interpretation codes
      if (code === 0) return { condition: 'Clear', icon: '☀️' };
      if (code <= 3) return { condition: 'Partly Cloudy', icon: '🌤️' };
      if (code <= 48) return { condition: 'Cloudy', icon: '☁️' };
      if (code <= 67) return { condition: 'Rainy', icon: '🌧️' };
      if (code <= 77) return { condition: 'Snowy', icon: '🌨️' };
      if (code <= 82) return { condition: 'Showers', icon: '🌦️' };
      if (code <= 99) return { condition: 'Thunderstorm', icon: '⛈️' };
      return { condition: 'Clear', icon: '☀️' };
    };

    // Helper function to get wind direction from degrees
    const getWindDirection = (degrees: number) => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const index = Math.round(degrees / 45) % 8;
      return directions[index];
    };

    // Helper function to format time
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const current = weatherApiData.current;
    const currentCondition = getWeatherCondition(current.weather_code);
    const baseTemp = current.temperature_2m;
    
    // Generate hourly forecast for next 24 hours from API data
    const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
      const hourData = weatherApiData.hourly;
      const hourCondition = getWeatherCondition(hourData.weather_code[i]);
      
      return {
        time: `${i}:00`,
        hour: i,
        temperature: Math.round(hourData.temperature_2m[i]),
        rainChance: Math.round(hourData.precipitation_probability[i] || 0),
        humidity: Math.round(hourData.relative_humidity_2m[i]),
        windSpeed: Math.round(hourData.wind_speed_10m[i]),
        condition: hourCondition.condition.toLowerCase(),
        icon: hourCondition.icon
      };
    });
    
    // Generate weekly forecast from API data
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyForecast = Array.from({ length: 7 }, (_, i) => {
      const dailyData = weatherApiData.daily;
      const date = new Date(dailyData.time[i]);
      const dayIndex = date.getDay();
      const dayCondition = getWeatherCondition(dailyData.weather_code[i]);
      
      const maxTemp = Math.round(dailyData.temperature_2m_max[i]);
      const minTemp = Math.round(dailyData.temperature_2m_min[i]);
      const rainProb = Math.round(dailyData.precipitation_probability_max[i] || 0);
      const windSpeed = Math.round(dailyData.wind_speed_10m_max[i]);
      
      // Determine farming suitability based on conditions
      let farmingSuitability: 'good' | 'moderate' | 'risky' = 'good';
      if (rainProb > 70 || windSpeed > 25 || maxTemp > 38) {
        farmingSuitability = 'risky';
      } else if (rainProb > 40 || windSpeed > 15 || maxTemp > 35) {
        farmingSuitability = 'moderate';
      }
      
      return {
        day: days[dayIndex],
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxTemp: maxTemp,
        minTemp: minTemp,
        rainProbability: rainProb,
        windSpeed: windSpeed,
        windDirection: getWindDirection(dailyData.wind_direction_10m_dominant[i]),
        pollenLevel: maxTemp > 30 ? 'High' : maxTemp > 25 ? 'Moderate' : 'Low',
        dustLevel: windSpeed > 20 ? 'High' : windSpeed > 10 ? 'Moderate' : 'Low',
        warnings: rainProb > 70 ? ['Heavy rain expected'] : maxTemp > 38 ? ['Extreme heat warning'] : [],
        condition: dayCondition.condition.toLowerCase(),
        icon: dayCondition.icon,
        farmingSuitability: farmingSuitability
      };
    });
    
    // Current weather data from API
    const currentTemp = Math.round(current.temperature_2m);
    const currentHumidity = Math.round(current.relative_humidity_2m);
    
    const weatherData = {
      current: {
        temperature: currentTemp,
        feelsLike: Math.round(current.apparent_temperature),
        humidity: currentHumidity,
        rainfall: parseFloat((current.precipitation || 0).toFixed(1)),
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: getWindDirection(current.wind_direction_10m),
        pressure: Math.round(current.pressure_msl),
        cloudCoverage: Math.round(current.cloud_cover),
        sunrise: formatTime(weatherApiData.daily.sunrise[0]),
        sunset: formatTime(weatherApiData.daily.sunset[0]),
        uvIndex: Math.round(weatherApiData.daily.uv_index_max[0]),
        maxTemp: Math.round(weatherApiData.daily.temperature_2m_max[0]),
        minTemp: Math.round(weatherApiData.daily.temperature_2m_min[0]),
        condition: currentCondition.condition
      },
      hourly: hourlyForecast,
      weekly: weeklyForecast,
      alerts: [],
      irrigation: {
        dailyNeed: currentHumidity < 50 ? 'High irrigation needed' : currentHumidity < 70 ? 'Moderate irrigation needed' : 'Low irrigation needed',
        waterAmount: currentHumidity < 50 ? '40-50 mm' : currentHumidity < 70 ? '30-40 mm' : '20-30 mm',
        soilMoisture: Math.round(100 - currentHumidity * 0.6),
        evapotranspiration: parseFloat((3 + Math.random() * 3).toFixed(1)),
        rainfall: parseFloat((Math.random() * 5).toFixed(1)),
        temperature: currentTemp,
        humidity: currentHumidity,
        skipIrrigation: Math.random() > 0.7,
        skipReason: 'Sufficient rainfall expected today',
        waterSavingTips: [
          'Use drip irrigation to reduce water waste by 40-50%',
          'Irrigate during early morning to minimize evaporation',
          'Apply mulch to retain soil moisture',
          'Check soil moisture before irrigating'
        ],
        cropSchedule: [
          { crop: 'Rice', timing: '6:00 AM - 8:00 AM', amount: '50 mm', method: 'Flood' },
          { crop: 'Wheat', timing: '5:00 PM - 7:00 PM', amount: '25 mm', method: 'Sprinkler' },
          { crop: 'Vegetables', timing: '6:30 AM - 7:30 AM', amount: '15 mm', method: 'Drip' }
        ]
      },
      soil: {
        drynessLevel: Math.round(40 + Math.random() * 30),
        drynessStatus: 'Moderate Dryness',
        temperature: Math.round(currentTemp - 2),
        temperatureStatus: 'Optimal for Growth',
        moistureScore: Math.round(45 + Math.random() * 30),
        moistureStatus: 'Good Moisture',
        nutrientLeaching: Math.round(15 + Math.random() * 25),
        leachingRisk: 'Low Risk',
        recommendations: [
          'Soil moisture is adequate - maintain current irrigation schedule',
          'Temperature is optimal for most crops',
          'Low risk of nutrient leaching - safe to apply fertilizers',
          'Consider adding organic matter to improve water retention'
        ]
      },
      trends: {
        data: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          temperature: Math.round(baseTemp + Math.sin(i) * 3),
          humidity: Math.round(60 + Math.sin(i * 1.5) * 15),
          rainfall: Math.round(Math.random() * 15),
          windSpeed: Math.round(10 + Math.random() * 8)
        })),
        insights: {
          temperature: 'Increasing temperature trend this week',
          humidity: 'Humidity levels fluctuating, peak on Saturday',
          rainfall: 'Scattered rainfall expected mid-week',
          wind: 'Wind speeds moderate throughout the week'
        }
      },
      tasks: {
        daily: [
          { id: '1', category: 'irrigation', title: 'Morning Irrigation', description: 'Water rice fields - maintain 2-3 inches depth', priority: 'high', timing: '6:00 AM - 8:00 AM', weatherSuitability: 'excellent', icon: '💧' },
          { id: '2', category: 'pest-control', title: 'Pest Monitoring', description: 'Check for leaf folder and brown plant hopper', priority: 'medium', timing: '9:00 AM - 11:00 AM', weatherSuitability: 'good', icon: '🐛' }
        ],
        weekly: [
          { id: '3', category: 'sowing', title: 'Wheat Sowing', description: 'Sow wheat seeds in prepared field', priority: 'high', timing: 'Wednesday morning', weatherSuitability: 'excellent', icon: '🌱' },
          { id: '4', category: 'weeding', title: 'Field Weeding', description: 'Remove weeds from vegetable plots', priority: 'medium', timing: 'Thursday afternoon', weatherSuitability: 'good', icon: '🌿' }
        ]
      }
    };
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/weather/current:
 *   get:
 *     summary: Get current weather
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude
 *     responses:
 *       200:
 *         description: Current weather data
 */
router.get('/current', async (req, res): Promise<void> => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
      return;
    }
    
    // Mock weather data
    const weatherData = {
      location: { lat: parseFloat(lat as string), lon: parseFloat(lon as string) },
      current: {
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 10,
        windSpeed: Math.random() * 20,
        pressure: 1010 + Math.random() * 20,
        description: 'Partly cloudy',
        icon: '02d'
      },
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/weather/forecast:
 *   get:
 *     summary: Get weather forecast
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *           default: 7
 *         description: Number of forecast days
 *     responses:
 *       200:
 *         description: Weather forecast
 */
router.get('/forecast', async (req, res): Promise<void> => {
  try {
    const { lat, lon, days = 7 } = req.query;
    
    if (!lat || !lon) {
      res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
      return;
    }
    
    // Mock forecast data
    const forecast = Array.from({ length: parseInt(days as string) }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      temperature: {
        min: 20 + Math.random() * 5,
        max: 30 + Math.random() * 10
      },
      humidity: 60 + Math.random() * 30,
      rainfall: Math.random() * 15,
      windSpeed: Math.random() * 25,
      description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)]
    }));
    
    res.json({
      success: true,
      data: {
        location: { lat: parseFloat(lat as string), lon: parseFloat(lon as string) },
        forecast
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;