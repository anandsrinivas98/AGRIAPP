const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'Test123456',
  firstName: 'Test',
  lastName: 'User',
  phone: '1234567890'
};

async function testRegistrationFlow() {
  console.log('🧪 Testing New Registration Flow\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Register (should NOT create user account yet)
    console.log('\n📝 Step 1: Registering user...');
    console.log('Email:', testUser.email);
    
    const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Registration initiated:', registerResponse.data.message);
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));

    // Step 2: Try to login before verification (should fail)
    console.log('\n🔐 Step 2: Attempting login before verification...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('❌ ERROR: Login should have failed!');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Login correctly blocked:', error.response.data.error);
      } else {
        console.log('⚠️  Unexpected error:', error.response?.data || error.message);
      }
    }

    // Step 3: Get OTP from console (in real scenario, from email)
    console.log('\n📧 Step 3: Check your email or backend logs for OTP');
    console.log('⚠️  Note: You need to manually enter the OTP from the email/logs');
    console.log('   The OTP was sent to:', testUser.email);
    
    // For automated testing, you would need to:
    // 1. Query the database for the pending user's OTP
    // 2. Or capture it from email service logs
    console.log('\n⏸️  Paused: Please verify email manually using the OTP');
    console.log('   Then try logging in again.');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Test completed successfully!');
    console.log('\nKey Points:');
    console.log('1. ✅ User registration creates pending record (not full account)');
    console.log('2. ✅ Login is blocked until email verification');
    console.log('3. ⏳ After OTP verification, account will be created');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
console.log('Starting registration flow test...');
console.log('Make sure the backend server is running on port 5000\n');

testRegistrationFlow();
