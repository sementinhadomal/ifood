// AtivusHub PIX creation test - with browser-like headers
async function testPixCreation() {
    const apiKey = 'd4d5947ab9eadf2b713c5c586012e47661c0b432db68e75582bb94ed97133b72';
    const apiKeyBase64 = Buffer.from(apiKey).toString('base64');
    const auth = `Basic ${apiKeyBase64}`;
    const baseUrl = 'https://api.ativushub.com.br';

    // Headers copied from the previous successful getCompany test
    const customHeaders = {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    };

    console.log('\n--- Testing PIX creation ---');
    const pixRes = await fetch(`${baseUrl}/v1/gateway/api/`, {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify({
            amount: 8.90,
            id_seller: 86385022,
            ip: '177.101.1.1',
            customer: {
                name: 'Teste Julia',
                email: 'teste@gmail.com',
                cpf: '37803662800',
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
