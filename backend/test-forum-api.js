require('dotenv').config();
const axios = require('axios');

async function testForumAPI() {
  try {
    console.log('🧪 Testing Forum API endpoints...\n');
    
    // Test threads
    console.log('1. Testing GET /api/forum/threads...');
    try {
      const threadsResponse = await axios.get('http://localhost:5000/api/forum/threads?limit=20');
      console.log('✅ Threads:', threadsResponse.data.length, 'found');
    } catch (error) {
      console.error('❌ Threads error:', error.response?.data || error.message);
    }
    
    // Test marketplace
    console.log('\n2. Testing GET /api/forum/marketplace...');
    try {
      const marketResponse = await axios.get('http://localhost:5000/api/forum/marketplace?limit=12');
      console.log('✅ Marketplace:', marketResponse.data.length, 'found');
    } catch (error) {
      console.error('❌ Marketplace error:', error.response?.data || error.message);
    }
    
    // Test knowledge
    console.log('\n3. Testing GET /api/forum/knowledge...');
    try {
      const knowledgeResponse = await axios.get('http://localhost:5000/api/forum/knowledge?limit=12');
      console.log('✅ Knowledge:', knowledgeResponse.data.length, 'found');
    } catch (error) {
      console.error('❌ Knowledge error:', error.response?.data || error.message);
    }
    
    // Test categories
    console.log('\n4. Testing GET /api/forum/categories...');
    try {
      const categoriesResponse = await axios.get('http://localhost:5000/api/forum/categories');
      console.log('✅ Categories:', categoriesResponse.data.length, 'found');
    } catch (error) {
      console.error('❌ Categories error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testForumAPI();
