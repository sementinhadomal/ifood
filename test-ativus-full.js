// AtivusHub API test - using correct Basic Auth format: base64(api_key + ":")
// Based on official AtivusHub API documentation

async function testPixCreation() {
    const apiKey = 'ade87e3d1859b5e5af1cd87dddd4bcad8881fa415b23ee0cc78b50a771c33819';
    const apiKeyBase64 = Buffer.from(`${apiKey}:`).toString('base64');
    const auth = `Basic ${apiKeyBase64}`;
    const baseUrl = 'https://api.ativushub.com.br';

    console.log('Auth header:', auth.slice(0, 40) + '...');

    // First test: getCompany
    console.log('\n--- Testing getCompany ---');
    const companyRes = await fetch(`${baseUrl}/s1/getCompany/`, {
        method: 'GET',
        headers: { Authorization: auth, 'Content-Type': 'application/json' }
    });
    const companyData = await companyRes.json().catch(() => ({}));
    console.log('Status:', companyRes.status);
    console.log('Data:', JSON.stringify(companyData, null, 2));

    // Second test: create PIX with all required fields including ip
    console.log('\n--- Testing PIX creation ---');
    const pixRes = await fetch(`${baseUrl}/v1/gateway/api/`, {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: 8.90,
            id_seller: 'sementinha_test',
            ip: '177.101.1.1',
            customer: {
                name: 'Teste Julia',
                email: 'teste@gmail.com',
                cpf: '12345678909',
                phone: '11999999999',
                externaRef: `test_${Date.now()}`,
                address: {
                    street: 'Avenida Paulista',
                    streetNumber: '123',
                    complement: 'Apto 1',
                    zipCode: '01310100',
                    neighborhood: 'Bela Vista',
                    city: 'Sao Paulo',
                    state: 'SP',
                    country: 'br'
                }
            },
            items: [{ title: 'Frete Bag iFood', quantity: 1, unitPrice: 8.90, tangible: false }],
            postbackUrl: 'https://agoraifoodbag.vercel.app/api/pix/webhook?gateway=ativushub',
            pix: { expiresInDays: 2 }
        })
    });
    const pixData = await pixRes.json().catch(() => ({}));
    console.log('Status:', pixRes.status);
    console.log('Data:', JSON.stringify(pixData, null, 2));
}

testPixCreation().catch(console.error);
