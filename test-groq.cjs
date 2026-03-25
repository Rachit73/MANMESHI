const https = require('https');

const data = JSON.stringify({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: "Hello" }],
  max_tokens: 10
});

const options = {
  hostname: 'api.groq.com',
  port: 443,
  path: '/openai/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_GROQ_API_KEY_HERE',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log('Response Body:', body);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
