const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(process.cwd(), 'data');
const PAGEVIEWS_FILE = path.join(DATA_DIR, 'pageviews.json');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';

function normalizePage(value) {
    const page = String(value || '').trim().toLowerCase();
    if (!page) return '';
    return page.replace(/[^a-z0-9_-]/g, '');
}

async function upsertPageview(sessionId, page) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        try {
            if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
            let leads = [];
            if (fs.existsSync(PAGEVIEWS_FILE)) {
                leads = JSON.parse(fs.readFileSync(PAGEVIEWS_FILE, 'utf8') || '[]');
            }
            const exists = leads.some(p => p.session_id === sessionId && p.page === page);
            if (!exists) {
                leads.push({ session_id: sessionId, page, created_at: new Date().toISOString() });
                fs.writeFileSync(PAGEVIEWS_FILE, JSON.stringify(leads, null, 2), 'utf8');
            }
            return { ok: true };
        } catch (error) {
            return { ok: false, reason: 'local_file_error', detail: error.message };
        }
    }

    const session = String(sessionId || '').trim();
    const pageName = normalizePage(page);
    if (!session || !pageName) {
        return { ok: false, reason: 'missing_data' };
    }

    const endpoint = `${SUPABASE_URL}/rest/v1/lead_pageviews`;
    const response = await fetchFn(endpoint, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=ignore-duplicates,return=minimal'
        },
        body: JSON.stringify([{ session_id: session, page: pageName }])
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => '');
        return { ok: false, reason: 'supabase_error', detail };
    }

    return { ok: true };
}

module.exports = {
    upsertPageview
};