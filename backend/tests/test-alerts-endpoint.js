require('dotenv').config();
const axios = require('axios');

async function testAlertsEndpoint() {
  try {
    console.log('🔍 Testing alerts endpoint...\n');
    
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@agrisense.com',
      password: 'Test@123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received\n');
    
    // Test alerts endpoint
    console.log('2. Fetching alerts...');
    const alertsResponse = await axios.get('http://localhost:5000/api/labour-scheduling/alerts', {
      params: { isRead: false },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const alerts = alertsResponse.data;
    console.log(`✅ Successfully fetched ${alerts.length} alerts\n`);
    
    if (alerts.length > 0) {
      console.log('📋 Sample alerts:');
      alerts.slice(0, 3).forEach((alert, index) => {
        console.log(`\n${index + 1}. [${alert.severity}] ${alert.title}`);
        console.log(`   ${alert.message}`);
        console.log(`   Type: ${alert.alertType} | Read: ${alert.isRead}`);
      });
    } else {
      console.log('⚠️  No alerts found. Run create-test-alerts.js first.');
    }
    
    console.log('\n✅ Alerts endpoint is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing alerts endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testAlertsEndpoint();
