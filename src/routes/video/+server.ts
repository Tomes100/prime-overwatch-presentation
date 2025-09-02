import type { RequestHandler } from '@sveltejs/kit';

const VIDEO_ASSET_URL = 'https://github.com/Tomes100/prime-overwatch-presentation/releases/download/v1.0.0/Prime.Overwatch.mp4';

function buildProxyHeaders(request: Request): Headers {
    const proxyHeaders = new Headers();

    const incomingRangeHeader = request.headers.get('range');
    if (incomingRangeHeader) {
        proxyHeaders.set('range', incomingRangeHeader);
    }

    // Hint acceptable content types
    proxyHeaders.set('accept', 'video/*;q=0.9, */*;q=0.1');

    return proxyHeaders;
}

function filterResponseHeaders(upstreamHeaders: Headers): Headers {
    const outgoing = new Headers();

    const headerNamesToPass = [
        'content-type',
        'content-length',
        'content-range',
        'accept-ranges',
        'cache-control',
        'etag',
        'last-modified'
    ];

    for (const name of headerNamesToPass) {
        const value = upstreamHeaders.get(name);
        if (value) outgoing.set(name, value);
    }

    // Ensure the content type is set properly for video
    if (!outgoing.has('content-type')) {
        outgoing.set('content-type', 'video/mp4');
    }

    // Enable streaming and seeking
    if (!outgoing.has('accept-ranges')) {
        outgoing.set('accept-ranges', 'bytes');
    }

    return outgoing;
}

export const GET: RequestHandler = async ({ request, fetch }) => {
    const upstream = await fetch(VIDEO_ASSET_URL, {
        method: 'GET',
        headers: buildProxyHeaders(request),
        redirect: 'follow'
    });

    return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: filterResponseHeaders(upstream.headers)
    });
};

export const HEAD: RequestHandler = async ({ request, fetch }) => {
    const upstream = await fetch(VIDEO_ASSET_URL, {
        method: 'HEAD',
        headers: buildProxyHeaders(request),
        redirect: 'follow'
    });

    return new Response(null, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: filterResponseHeaders(upstream.headers)
    });
};


