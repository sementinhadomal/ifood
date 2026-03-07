(() => {
    const pixelId = String(window.pixelId || '').trim();
    if (!pixelId) return;

    // UTMify Check: If it looks like a UTMify ID (usually long hex)
    if (pixelId.length > 20) {
        if (window.__ifoodUtmifyInit === pixelId) return;
        window.__ifoodUtmifyInit = pixelId;

        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
        document.head.appendChild(script);
        return;
    }

    if (!window.__ifbLegacyPixelInits || typeof window.__ifbLegacyPixelInits !== 'object') {
        window.__ifbLegacyPixelInits = {};
    }
    if (window.__ifbLegacyPixelInits[pixelId]) return;

    const ensureInit = () => {
        if (typeof window.fbq !== 'function') return;
        try {
            window.fbq('set', 'autoConfig', false, pixelId);
            window.fbq('init', pixelId);
            window.__ifbLegacyPixelInits[pixelId] = true;
        } catch (_error) { }
    };

    if (typeof window.fbq === 'function') {
        ensureInit();
        return;
    }

    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod
                ? n.callMethod.apply(n, arguments)
                : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    ensureInit();
})();
