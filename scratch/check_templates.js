const baseUrl = process.env.WHATSAPP_BASE_URL || 'https://wa.ratehonk.com';
const apiKey = process.env.WHATSAPP_API_KEY;

async function check() {
  try {
    const res = await fetch(baseUrl + '/api/project/v1/templates', {
      headers: { 'X-API-Key': apiKey }
    });
    if (!res.ok) {
      console.log('HTTP error:', res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log('Total templates found:', data.length);
    for (const t of data) {
      console.log('---------------------------------------------');
      console.log('Name:', t.name);
      console.log('Category:', t.category);
      console.log('Status:', t.status);
      console.log('TemplateId:', t.templateId);
      console.log('Components:', JSON.stringify(t.components));
    }
  } catch (err) {
    console.error('Error details:', err.cause || err);
  }
}

check();
