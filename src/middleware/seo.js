/**
 * SEO Middleware
 * Adds necessary headers for SEO purposes
 */
function seoHeaders(req, res, next) {
    // Enable CORS for Next.js frontend
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Add cache control headers for static content
    // Use only for GET requests and non-authenticated routes
    if (req.method === 'GET' && !req.path.includes('/api/auth/')) {
        // Max age: 1 hour, stale-while-revalidate: 1 day
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    } else {
        // Prevent caching for dynamic content
        res.setHeader('Cache-Control', 'no-store, max-age=0');
    }

    next();
}

module.exports = { seoHeaders }; 