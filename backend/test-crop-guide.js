const axios = require('axios');

async function testCropGuideAPI() {
  try {
    console.log('🧪 Testing Crop Guide API...');
    
    // Test popular crops endpoint (no auth required)
    console.log('\n1. Testing popular crops endpoint...');
    const popularCropsResponse = await axios.get('http://localhost:5000/api/crop-guide/popular-crops');
    console.log('✅ Popular crops:', popularCropsResponse.data.data.slice(0, 5), '...');
    
    // For authenticated endpoints, you would need a valid JWT token
    console.log('\n2. Crop guide generation requires authentication');
    console.log('   Use the frontend to test the full functionality');
    
    console.log('\n✅ Crop Guide API is working!');
    
  } catch (error) {
    console.error('❌ Error testing Crop Guide API:', error.response?.data || error.message);
  }
}

testCropGuideAPI();