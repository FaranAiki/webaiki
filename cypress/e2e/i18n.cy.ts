describe('I18n Navigation', () => {
  it('should change language to English and update content', () => {
    // 1. Visit the home page (default ID)
    cy.visit('/id');
    cy.get('h1').should('contain', 'Tentang Saya');

    // 2. Click language selector
    // Using force: true in case of some overlay/animation issues during test
    cy.get('button[aria-label="Select language"]').click();
    
    // 3. Select English
    cy.contains('button', 'English').click();

    // 4. Verify URL and Content
    cy.url().should('include', '/en');
    cy.get('h1').should('contain', 'About Me');
  });
});
