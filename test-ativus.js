const { getPaymentsConfig } = require('./lib/payments-config-store');
const { requestCreateTransaction, getSellerId } = require('./lib/ativushub-provider');

async function testAtivus() {
    const payments = await getPaymentsConfig();
    const gatewayConfig = payments?.gateways?.ativushub;

    if (!gatewayConfig) {
        console.error('AtivusHUB config not found');
        return;
    }

    const sellerId = await getSellerId(gatewayConfig);
    console.log('Resolved sellerId:', sellerId);

    const baseRef = 'test_' + Date.now();

    const basePayload = {
        amount: 8.90,
        id_seller: sellerId,
        customer: {
            name: 'Teste Antigravity',
            email: 'teste@exemplo.com',
            cpf: '12345678909',
            phone: '11999999999',
            externaRef: '',
            address: {
                street: 'Rua Teste',
                streetNumber: '123',
                complement: 'Casa',
                zipCode: '01001000',
                neighborhood: 'Centro',
                city: 'Sao Paulo',
                state: 'SP',
                country: 'br'
            }
        },
        items: [{ title: 'Frete Bag', quantity: 1, unitPrice: 8.90, tangible: false }],
        postbackUrl: 'https://example.com/webhook',
        pix: { expiresInDays: 2 }
    };

    async function tryPayload(name, p) {
        console.log(`\n--- Trying Payload: ${name} ---`);
        const { response, data } = await requestCreateTransaction(gatewayConfig, p);
        console.log(`Response Status: ${response.status}`);
        console.log(`Response Data:`, JSON.stringify(data, null, 2));
        return data;
    }

    // Variant 1: Original decimal amount (float)
    await tryPayload('Decimal 8.90', {
        ...basePayload,
        customer: { ...basePayload.customer, externaRef: baseRef + '_v1' }
    });

    // Variant 2: Decimal amount with valid CPF
    await tryPayload('Decimal 10.00 + Valid CPF', {
        ...basePayload,
        amount: 10.00,
        customer: {
            ...basePayload.customer,
            externaRef: baseRef + '_v2',
            cpf: '37803662800'
        }
    });

    // Variant 3: Cents amount (integer)
    await tryPayload('Cents 890 (integer)', {
        ...basePayload,
        amount: 890,
        customer: { ...basePayload.customer, externaRef: baseRef + '_v3' }
    });

    // Variant 4: String amount "8.90"
    await tryPayload('String "8.90"', {
        ...basePayload,
        amount: "8.90",
        customer: { ...basePayload.customer, externaRef: baseRef + '_v4' }
    });

    // Variant 5: Remove pix object entirely
    await tryPayload('No PIX object', {
        ...basePayload,
        customer: { ...basePayload.customer, externaRef: baseRef + '_v5' },
        pix: undefined
    });

    // Variant 6: Different pix object format
    await tryPayload('PIX object with different fields', {
        ...basePayload,
        customer: { ...basePayload.customer, externaRef: baseRef + '_v6' },
        pix: {
            expires: 3600, // seconds instead of days?
        }
    });

    // Variant 8: Exact amount from screenshot
    await tryPayload('Exact Amount 35.80', {
        ...basePayload,
        amount: 35.80,
        customer: { ...basePayload.customer, externaRef: baseRef + '_v8' }
    });
}

testAtivus().catch(console.error);
