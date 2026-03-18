const { getPaymentsConfig } = require('./lib/payments-config-store');
const { fetchJsonWithTimeout, normalizeAuthCandidates } = require('./lib/ativushub-provider');

async function checkCompany() {
    const payments = await getPaymentsConfig();
    const config = payments?.gateways?.ativushub;

    if (!config) {
        console.error('AtivusHUB config not found');
        return;
    }

    const baseUrl = String(config.baseUrl || '').replace(/\/+$/, '');
    const authVariants = normalizeAuthCandidates(config);

    console.log('Checking AtivusHub Company Info...');

    for (const auth of authVariants) {
        console.log(`\n--- Trying Auth Variant: ${auth.substring(0, 10)}... ---`);
        try {
            const { response, data } = await fetchJsonWithTimeout(`${baseUrl}/s1/getCompany/`, {
                method: 'GET',
                headers: {
                    Authorization: auth,
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            console.log('Response Status:', response.status);
            console.log('Response Data:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.error('Error:', e.message);
        }
    }
}

checkCompany().catch(console.error);
