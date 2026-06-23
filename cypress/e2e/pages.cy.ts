Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error #310') || err.message.includes('NEXT_REDIRECT')) {
    return false;
  }
  return true;
});

describe('Page Navigation and Rendering', () => {
  const pages = [
    '/en',
    '/en/all',
    '/en/award',
    '/en/business-requests',
    '/en/certificate',
    '/en/college',
    '/en/feedback',
    '/en/hire-me',
    '/en/identity',
    '/en/music',
    '/en/news',
    '/en/organization',
    '/en/portfolio',
    '/en/project',
    '/en/social',
    '/en/website',
    '/en/work',
  ];

  pages.forEach((page) => {
    it(`Should load ${page} successfully`, () => {
      cy.visit(page);
      cy.get('body').should('be.visible');
      cy.wait(500); // Give a bit of time for animations or initial hydration
    });
  });
});
