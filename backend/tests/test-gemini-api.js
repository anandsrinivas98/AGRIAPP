require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API directly...\n');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 20)}...` : '❌ Missing');
  console.log('─'.repeat(60));

  // Test 1: List available models
  console.log('\n📋 Fetching available models...');
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (response.ok && data.models) {
      console.log(`✅ Found ${data.models.length} models:\n`);
      
      const chatModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      console.log('💬 MODELS THAT SUPPORT CHAT (generateContent):');
      chatModels.forEach(model => {
        console.log(`   ✓ ${model.name.replace('models/', '')}`);
        console.log(`     Display: ${model.displayName}`);
        console.log(`     Description: ${model.description?.substring(0, 80)}...`);
        console.log('');
      });
      
      if (chatModels.length > 0) {
        console.log('\n🎯 RECOMMENDED FOR YOUR CHATBOT:');
        const recommended = chatModels[0].name.replace('models/', '');
        console.log(`   Use: "${recommended}"\n`);
        
        // Test the recommended model
        console.log(`🧪 Testing ${recommended}...`);
        const testResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${recommended}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'Say hello' }]
              }]
            })
          }
        );
        
        const testData = await testResponse.json();
        if (testResponse.ok && testData.candidates) {
          console.log('✅ Model works! Response:', testData.candidates[0].content.parts[0].text.substring(0, 50));
        } else {
          console.log('❌ Model test failed:', testData.error?.message || 'Unknown error');
        }
      }
      
    } else {
      console.log('❌ Error fetching models:', data.error?.message || 'Unknown error');
      if (data.error?.status === 'PERMISSION_DENIED') {
        console.log('\n⚠️  Your API key does not have permission to access Gemini API');
        console.log('   Please enable Gemini API in Google AI Studio:');
        console.log('   https://aistudio.google.com/app/apikey');
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testGeminiAPI();
