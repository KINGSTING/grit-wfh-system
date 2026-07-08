
require('dotenv').config();

async function test() {
  try {
    const url = 'https://segjuaenosiiddvpfdnm.supabase.co/rest/v1/';
    const response = await fetch(url, {
      headers: { 'apikey': process.env.SUPABASE_ANON_KEY }
    });
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();