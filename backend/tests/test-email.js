/**
 * Email Service Test Script
 * 
 * This script tests your email configuration.
 * Run with: node test-email.js your_test_email@example.com
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = process.argv[2];

if (!testEmail) {
  console.error('❌ Please provide a test email address');
  console.log('Usage: node test-email.js your_email@example.com');
  process.exit(1);
}

console.log('🔧 Testing Email Configuration...\n');

// Check environment variables
console.log('📋 Configuration:');
console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || '❌ Not set'}`);
console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || '❌ Not set'}`);
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ Not set'}`);
console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set'}`);
console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ Not set'}\n`);

if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Email configuration incomplete. Please check your .env file.');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email
const mailOptions = {
  from: process.env.EMAIL_FROM || 'AgriSense <noreply@agrisense.com>',
  to: testEmail,
  subject: '✅ AgriSense Email Test',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌾 AgriSense</h1>
          <p>Email Configuration Test</p>
        </div>
        <div class="content">
          <div class="success">
            <strong>✅ Success!</strong>
            <p>Your email configuration is working correctly.</p>
          </div>
          <p>This is a test email from your AgriSense application.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Host: ${process.env.EMAIL_HOST}</li>
            <li>Port: ${process.env.EMAIL_PORT}</li>
            <li>User: ${process.env.EMAIL_USER}</li>
          </ul>
          <p>You're all set to send verification emails and password reset links!</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    AgriSense Email Test
    
    ✅ Success! Your email configuration is working correctly.
    
    Configuration Details:
    - Host: ${process.env.EMAIL_HOST}
    - Port: ${process.env.EMAIL_PORT}
    - User: ${process.env.EMAIL_USER}
    
    You're all set to send verification emails and password reset links!
  `,
};

console.log('📧 Sending test email...\n');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Email sending failed:');
    console.error(error.message);
    console.log('\n💡 Common issues:');
    console.log('   1. Gmail: Make sure you\'re using an App Password, not your regular password');
    console.log('   2. Gmail: Enable 2-Step Verification first');
    console.log('   3. Check if your email provider allows SMTP access');
    console.log('   4. Verify EMAIL_HOST and EMAIL_PORT are correct');
    process.exit(1);
  } else {
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${testEmail}`);
    console.log('\n🎉 Your email configuration is working correctly!');
    console.log('   You can now use email verification and password reset features.');
  }
});
