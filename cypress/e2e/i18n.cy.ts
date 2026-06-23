describe('I18n Navigation', () => {
  it('should change language to English and update content', () => {
    // 1. Visit the home page (default ID)
    cy.visit('/id');
    // Ensure we're on ID language
    cy.url().should('include', '/id');

    // 2. Click settings selector
    cy.get('button:has(.lucide-settings)').first().click({ force: true });
    
    // 3. Click language dropdown (since it starts in Indonesian)
    cy.contains('button', 'Indonesia').click({ force: true });

    // 4. Select English (in Indonesian it's "Inggris")
    cy.contains('button', 'Inggris').click({ force: true });

    // 4. Verify URL and Content
    cy.url().should('include', '/en');
    cy.get('body').should('contain', 'Latest Activity');
  });
});
