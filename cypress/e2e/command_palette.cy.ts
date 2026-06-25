describe('Command Palette', () => {
  beforeEach(() => {
    cy.visit('/en');
    cy.wait(500); // Wait for hydration
  });

  it('should open command palette using keyboard shortcut (Ctrl+K)', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.cmdk-dialog').should('be.visible');
    
    // Type to search
    cy.get('input[placeholder="Type a command or search..."]').type('Projects');
    
    // Verify search results filter
    cy.contains('Projects').should('be.visible');
  });

  it('should open command palette using keyboard shortcut (Cmd+K on Mac)', () => {
    cy.get('body').type('{meta}k');
    cy.get('.cmdk-dialog').should('be.visible');
    
    // Select a theme
    cy.contains('Dark Theme').click({ force: true });
    cy.get('.cmdk-dialog').should('not.exist');
    
    // Command palette should close after clicking
  });
});
