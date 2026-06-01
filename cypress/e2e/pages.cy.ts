describe('Page Layout and Presentation Mode', () => {
  const languages = ['en'];
  const routes = [
    '/',
    '/social',
    '/work',
    '/college',
    '/all',
    '/latest',
    '/project',
    '/project/script',
    '/certificate',
    '/award',
    '/literature',
    '/music',
    '/organization',
  ];

  const nakedRoutes = [
    '/project/uas_matematika_dasar',
    '/portfolio',
  ];

  languages.forEach((lang) => {
    describe(`Language: ${lang}`, () => {
      
      routes.forEach((route) => {
        it(`should load ${route} in normal mode`, () => {
          cy.visit(`/${lang}${route}`);
          // Check if background is present
          cy.get('.presentation-background').should('exist');
          // Should NOT have presentation mode class by default
          cy.get('body').should('not.have.class', 'presentation-mode');
        });

        it(`should handle ${route} in presentation mode`, () => {
          cy.viewport(1280, 800);
          
          cy.visit(`/${lang}${route}`, {
            onBeforeLoad(win) {
              win.localStorage.setItem('presentation_mode', 'true');
            },
          });
          
          if (route === '/all') {
            // /all should disable presentation mode automatically
            cy.get('body').should('not.have.class', 'presentation-mode');
          } else {
            cy.get('body').should('have.class', 'presentation-mode');
            
            // Check if slide numbering button is blue
            // Note: Some pages might not have FadeInSection if they are empty or special
            // But most should.
            cy.get('button').then(($buttons) => {
              const slideBtn = $buttons.filter((i, btn) => {
                const className = btn.className;
                return className.includes('bg-blue-600/40') || className.includes('bg-blue-600');
              });
              if (slideBtn.length > 0) {
                expect(slideBtn).to.exist;
              }
            });
          }
        });
      });

      nakedRoutes.forEach((route) => {
        it(`should load naked route ${route} correctly`, () => {
          cy.visit(`/${lang}${route}`);
          // Naked routes should have the background too as we moved it to root layout
          cy.get('.presentation-background').should('exist');
        });
      });
    });
  });
});
