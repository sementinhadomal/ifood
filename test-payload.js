const { sendUtmfy } = require('./lib/utmfy');

// Mock buildUtmfyOrder logic (since it's not exported, we test via sendUtmfy behavior if possible, 
// or we can just mock the payload and see if it hits the internal logic correctly if we were to export it)
// For this test, we'll focus on the data structure we just updated.

const mockPayload = {
    sessionId: 'test-session-123',
    amount: 19.90,
    personal: { name: 'Test User', email: 'test@example.com', cpf: '12345678901', phoneDigits: '11999999999' },
    utm: {
        utm_source: 'facebook',
        fbclid: 'FB-CLICK-ID-123',
        gclid: 'G-CLICK-ID-123',
        fbp: 'fbp.1.123',
        fbc: 'fbc.1.123'
    },
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X)'
};

console.log('Testing UTMify payload structure...');
// We can't easily test the private buildUtmfyOrder without modifying the file to export it,
// but we can verify the file content visually or via a small node script if we were to export it.

// Let's create a temporary file that exports the internal function for testing.
