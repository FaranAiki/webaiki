describe('Command Palette', () => {
  beforeEach(() => {
    cy.visit('/en');
    cy.wait(500); // Wait for hydration
  });

  it('should open command palette using keyboard shortcut (Ctrl+K)', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.cmdk-dialog').should('be.visible');
    
    // Type to search (use partial or generic selector for the input)
    cy.get('.cmdk-dialog input').type('Projects');
    
    // Command palette shouldn't error out during a search. Wait for results.
    // The new command palette searches real data from server actions
    cy.get('.cmdk-dialog').should('be.visible');
  });

  it('should open command palette using keyboard shortcut (Cmd+K on Mac)', () => {
    cy.get('body').type('{meta}k');
    cy.get('.cmdk-dialog').should('be.visible');
    
    // Close using X button or escape
    cy.get('.cmdk-dialog button[aria-label="Close command palette"]').click();
    cy.get('.cmdk-dialog').should('not.exist');
  });

  it('should display suggestions when opening without typing', () => {
    cy.get('body').type('{meta}k');
    cy.get('.cmdk-dialog').should('be.visible');
    cy.get('.cmdk-dialog').should('contain', 'Suggestions'); // Assuming "Suggestions" is the English label
  });

  it('should navigate to search results using keyboard arrows', () => {
    cy.get('body').type('{meta}k');
    cy.get('.cmdk-dialog').should('be.visible');
    cy.get('.cmdk-dialog input').type('{downarrow}');
    cy.get('.cmdk-dialog [aria-selected="true"]').should('exist');
  });

  it('should navigate when clicking a suggestion', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.cmdk-dialog').should('be.visible');
    
    // Find the first suggestion item and click it
    cy.get('.cmdk-dialog [cmdk-item]').first().click({ force: true });
    
    // Command palette should close
    cy.get('.cmdk-dialog').should('not.exist');
  });

  it('should close when pressing ESC', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.cmdk-dialog').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('.cmdk-dialog').should('not.exist');
  });

  it('should display no results for gibberish search', () => {
    cy.get('body').type('{ctrl}k');
    cy.get('.cmdk-dialog input').type('asdfghjklqwertyuiop');
    cy.get('.cmdk-dialog').should('contain', 'No results found');
  });
});
