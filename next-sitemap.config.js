
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://formatters.net',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.8,
    sitemapSize: 5000,
    transform: async (config, url) => {
        if (url === 'https://formatters.net/') {
            return {
                loc: url,
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString(),
            }
        }
        if (url.includes('/formatter/')) {
            return {
                loc: url,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            }
        }
        if (url.includes('/tools/')) {
            return {
                loc: url,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            }
        }

        return {
            loc: url,
            changefreq: 'daily',
            priority: 0.8,
            lastmod: new Date().toISOString(),
        }
    },
}