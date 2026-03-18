// Using native fetch if available (Node 18+)
const fetchFn = typeof fetch !== 'undefined' ? fetch : (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function runTest(amount) {
    console.log(`\n--- Testing Amount: R$ ${amount.toFixed(2)} ---`);

    // Create Session
    const sessionRes = await fetchFn('http://localhost:3004/api/site/session', {
        method: 'GET'
    });
    const sessionCookie = sessionRes.headers.get('set-cookie');

    // Create PIX
    const createRes = await fetchFn('http://localhost:3004/api/pix/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie
        },
        body: JSON.stringify({
            amount: amount,
            personal: {
                name: `Teste Paradise R$${amount.toFixed(2)}`,
                email: 'testemulti@paradise.com',
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

    if (createData.paymentCode) {
        console.log(`SUCCESS: PIX generated! TxID: ${createData.idTransaction}`);
        return true;
    } else {
        console.error(`FAILED for R$ ${amount.toFixed(2)}:`, JSON.stringify(createData));
        return false;
    }
}

async function startBatch() {
    const amounts = [5.50, 12.90, 18.00, 24.15, 29.99];
    let successCount = 0;

    for (const amount of amounts) {
        const ok = await runTest(amount);
        if (ok) successCount++;
        // Small delay to avoid rate limiting or race conditions
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n=== Batch Completed: ${successCount}/5 Successful ===`);
}

startBatch().catch(console.error);
