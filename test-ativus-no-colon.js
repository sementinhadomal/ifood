// AtivusHub API test - without colon suffix
async function testPixCreation() {
    const apiKey = 'd4d5947ab9eadf2b713c5c586012e47661c0b432db68e75582bb94ed97133b72';
    const apiKeyBase64 = Buffer.from(apiKey).toString('base64');
    const auth = `Basic ${apiKeyBase64}`;
    const baseUrl = 'https://api.ativushub.com.br';

    console.log('Auth header (no colon):', auth.slice(0, 40) + '...');

    console.log('\n--- Testing getCompany (no colon) ---');
    const companyRes = await fetch(`${baseUrl}/s1/getCompany/`, {
        method: 'GET',
        headers: { Authorization: auth, 'Content-Type': 'application/json' }
    });
    const companyData = await companyRes.json().catch(() => ({}));
    console.log('Status:', companyRes.status);
    console.log('Data:', JSON.stringify(companyData, null, 2));
}

testPixCreation().catch(console.error);
