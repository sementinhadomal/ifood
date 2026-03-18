// Node 24+ has native fetch

async function testGetCompany() {
    const apiKey = 'ade87e3d1859b5e5af1cd87dddd4bcad8881fa415b23ee0cc78b50a771c33819';
    // Correct format: base64(api_key + ":") per AtivusHub docs
    const apiKeyBase64WithColon = Buffer.from(`${apiKey}:`).toString('base64');
    const baseUrl = 'https://api.ativushub.com.br';

    const authVariants = [
        `Basic ${apiKeyBase64WithColon}`,
        apiKey
    ];

    console.log('Testing /s1/getCompany/ ...');
    for (const auth of authVariants) {
        console.log(`\nTrying auth: ${auth.slice(0, 30)}...`);
        try {
            const res = await fetch(`${baseUrl}/s1/getCompany/`, {
                method: 'GET',
                headers: {
                    Authorization: auth,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json().catch(() => ({}));
            console.log('Status:', res.status);
            console.log('Data:', JSON.stringify(data, null, 2));
            if (res.ok) break;
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

testGetCompany().catch(console.error);
