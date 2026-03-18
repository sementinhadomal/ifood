// Test PIX generation against the LIVE Vercel site
async function testLiveSite() {
    const baseUrl = 'https://agoraifoodbag.vercel.app';

    console.log('--- Step 1: Create Session on live site ---');
    const sessionRes = await fetch(`${baseUrl}/api/site/session`, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' }
    });
    const cookie = sessionRes.headers.get('set-cookie');
    console.log('Session status:', sessionRes.status);
    console.log('Cookie received:', cookie ? 'YES' : 'NO');

    console.log('\n--- Step 2: Generate PIX on live site ---');
    const pixRes = await fetch(`${baseUrl}/api/pix/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie || '',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
            'Origin': baseUrl
        },
        body: JSON.stringify({
            amount: 8.90,
            personal: {
                name: 'Teste Verificacao',
                email: 'teste@gmail.com',
                cpf: '52998224725',
                phone: '11999999999'
            },
            address: {
                cep: '01310100',
                street: 'Avenida Paulista',
                streetNumber: '123',
                complement: 'Apto 1',
                neighborhood: 'Bela Vista',
                city: 'Sao Paulo',
                state: 'SP'
            },
            gateway: 'ativushub'
        })
    });

    const data = await pixRes.json().catch(() => ({}));
    console.log('PIX status:', pixRes.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.paymentCode) {
        console.log('\n✅ SUCESSO! Código PIX gerado:', data.paymentCode.slice(0, 60) + '...');
        console.log('Transaction ID:', data.idTransaction);
    } else if (data.error) {
        console.log('\n❌ ERRO:', data.error, data.detail || '');
    }
}

testLiveSite().catch(console.error);
