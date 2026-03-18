// AtivusHub API test - with browser-like User-Agent
async function testPixCreation() {
    const apiKey = 'd4d5947ab9eadf2b713c5c586012e47661c0b432db68e75582bb94ed97133b72';
    const apiKeyBase64 = Buffer.from(apiKey).toString('base64');
    const auth = `Basic ${apiKeyBase64}`;
    const baseUrl = 'https://api.ativushub.com.br';

    console.log('--- Testing /s1/getCompany/ with Browser User-Agent ---');
    const res = await fetch(`${baseUrl}/s1/getCompany/`, {
        method: 'GET',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        }
    });

    const data = await res.json().catch(() => ({}));
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(data, null, 2));
}

testPixCreation().catch(console.error);
