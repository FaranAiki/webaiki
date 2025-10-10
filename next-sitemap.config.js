module.exports = {
  siteUrl: 'https:/faranaiki.id',

  generateRobotsTxt: true,

  exclude: ['/admin*', '/thank-you'],

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
    /*additionalSitemaps: [
      `${process.env.SITE_URL || 'https://www.example.com'}/sitemap.xml`,
    ],*/
  },

  transform: async (config, path) => {
    return {
      loc: path, // The URL of the page
      changefreq: 'daily', // How often the page is expected to change
      priority: 0.7, // The priority of the page relative to other pages on the site
      lastmod: new Date().toISOString(), // The last modification date of the page
    };
  },
};
