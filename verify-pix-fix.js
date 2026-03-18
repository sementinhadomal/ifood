// Node 24+ has native fetch

async function verifyFix() {
    console.log('--- Step 1: Create Session ---');
    const sessionRes = await fetch('http://localhost:3000/api/site/session', {
        method: 'GET'
    });
    const sessionCookie = sessionRes.headers.get('set-cookie');
    console.log('Session Cookie:', sessionCookie);

    console.log('\n--- Step 2: Create PIX ---');
    const createRes = await fetch('http://localhost:3000/api/pix/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie
        },
        body: JSON.stringify({
            amount: 8.90,
            personal: {
                name: 'Teste Local',
                email: 'teste@local.com',
                cpf: '12345678909',
                phone: '11999999999'
            },
            address: {
                cep: '01310100',
                street: 'Avenida Paulista',
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

    if (createData.paymentCode) {
        console.log('SUCCESS: PIX Code generated on first try!');
    } else if (createData.idTransaction) {
        console.log('PIX Code missing, polling status...');
        const txid = createData.idTransaction;

        for (let i = 1; i <= 5; i++) {
            console.log(`Polling attempt ${i}...`);
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await fetch('http://localhost:3000/api/pix/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': sessionCookie
                },
                body: JSON.stringify({
                    txid: txid,
                    gateway: 'paradise'
                })
            });
            const statusData = await statusRes.json();
            console.log('Status Response:', JSON.stringify(statusData, null, 2));
            if (statusData.paymentCode) {
                console.log('SUCCESS: PIX Code hydrated via polling!');
                break;
            }
        }
    } else {
        console.error('FAILED: No transaction ID returned.');
    }
}

verifyFix().catch(console.error);
