const baseUrl = process.env.WHATSAPP_BASE_URL || 'https://wa.ratehonk.com';
const apiKey = process.env.WHATSAPP_API_KEY;

async function testCreateTemplate() {
  try {
    const res = await fetch(baseUrl + '/api/project/v1/templates', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Test probe to check validation response
      })
    });
    const data = await res.json().catch(() => ({}));
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testCreateTemplate();

