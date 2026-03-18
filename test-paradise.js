// Using native fetch if available (Node 18+)
const fetchFn = typeof fetch !== 'undefined' ? fetch : (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function verifyParadise() {
    console.log('--- Phase 1: Create Session ---');
    const sessionRes = await fetchFn('http://localhost:3004/api/site/session', {
        method: 'GET'
    });
    const sessionCookie = sessionRes.headers.get('set-cookie');
    console.log('Session Cookie:', sessionCookie);

    console.log('\n--- Phase 2: Create PIX (Paradise) ---');
    const createRes = await fetchFn('http://localhost:3004/api/pix/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie
        },
        body: JSON.stringify({
            amount: 8.90,
            personal: {
                name: 'Teste Paradise',
                email: 'teste@paradise.com',
                cpf: '12345678909',
                phone: '11999999999'
            },
            address: {
                cep: '01310100',
                number: '123',
                neighborhood: 'Centro',
                city: 'Sao Paulo',
                state: 'SP'
            },
            gateway: 'paradise'
        })
    });

    const createData = await createRes.json();
    console.log('Create Response:', JSON.stringify(createData, null, 2));

    if (createData.paymentCode || createData.paymentQrUrl) {
        console.log('\nSUCCESS: PIX generated via Paradise!');
        console.log('Transaction ID:', createData.idTransaction);
        console.log('Gateway Used:', createData.gateway);
    } else {
        console.error('\nFAILED: PIX creation did not return payment details.');
    }
}

verifyParadise().catch(console.error);
