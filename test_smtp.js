const nodemailer = require('nodemailer');

async function testSMTP() {
  console.log("Testing SMTP Connection for Hostinger...");
  
  let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'info@claudemining.com',
      pass: 'Asimyaqoobmi9@' // The password from .env
    }
  });

  try {
    let info = await transporter.verify();
    console.log("✅ Success! SMTP Connection is working.");
    console.log(info);
  } catch (error) {
    console.error("❌ Failed to connect to SMTP:");
    console.error(error.message);
  }
}

testSMTP();
