const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of models to test
const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.0-pro',
  'gemini-1.0-pro-latest',
  'gemini-1.0-pro-001',
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello');
    const response = await result.response;
    const text = response.text();
    
    if (text && text.length > 0) {
      console.log(`✅ ${modelName} - WORKS`);
      return true;
    }
  } catch (error) {
    if (error.message.includes('404') || error.message.includes('not found')) {
      console.log(`❌ ${modelName} - NOT FOUND`);
    } else if (error.message.includes('API key')) {
      console.log(`🔑 ${modelName} - API KEY ERROR`);
    } else {
      console.log(`⚠️  ${modelName} - ERROR: ${error.message.substring(0, 50)}`);
    }
    return false;
  }
}

async function testAllModels() {
  console.log('🔍 Testing Gemini models with your API key...\n');
  console.log('API Key:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');
  console.log('─'.repeat(60));
  
  const workingModels = [];
  
  for (const modelName of modelsToTest) {
    const works = await testModel(modelName);
    if (works) {
      workingModels.push(modelName);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('─'.repeat(60));
  console.log('\n📊 SUMMARY:');
  console.log(`Total models tested: ${modelsToTest.length}`);
  console.log(`Working models: ${workingModels.length}`);
  
  if (workingModels.length > 0) {
    console.log('\n✅ RECOMMENDED MODELS FOR YOUR CHATBOT:');
    workingModels.forEach((model, index) => {
      console.log(`${index + 1}. ${model}`);
    });
    console.log('\n💡 Best choice: Use the first working model from the list above');
  } else {
    console.log('\n❌ No working models found. Please check:');
    console.log('   1. API key is valid');
    console.log('   2. API key has Gemini API enabled');
    console.log('   3. You have quota/credits available');
  }
}

testAllModels().catch(console.error);
