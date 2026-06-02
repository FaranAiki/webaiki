describe('Typography Settings Persistence and Application', () => {
  const languages = ['en'];
  const routes = [
    '/',
    '/work',
    '/portfolio',
  ];

  languages.forEach((lang) => {
    routes.forEach((route) => {
      it(`should apply line height and letter spacing from localStorage on ${lang}${route}`, () => {
        cy.viewport(1280, 800);
        
        // Set settings in localStorage AND cookies BEFORE visiting
        cy.on('window:before:load', (win) => {
          win.localStorage.setItem('settings-lineheight', '2.5');
          win.localStorage.setItem('settings-spacing', '8');
        });
        
        cy.setCookie('settings-lineheight', '2.5');
        cy.setCookie('settings-spacing', '8');

        cy.visit(`/${lang}${route}`);
        
        // Ensure the page is loaded
        cy.get('body').should('be.visible');

        // Wait for React to mount and useEffect to run
        cy.wait(1000);

        // Verify CSS variables on :root
        cy.document().then((doc) => {
          const root = doc.documentElement;
          // Use getComputedStyle if getPropertyValue is empty (though it shouldn't be if set via style.setProperty)
          const lh = root.style.getPropertyValue('--app-line-height');
          const ls = root.style.getPropertyValue('--app-letter-spacing');
          
          cy.log(`Line Height: ${lh}`);
          cy.log(`Letter Spacing: ${ls}`);
          
          expect(lh).to.equal('2.5');
          expect(ls).to.equal('8px');
        });

        // Verify computed styles on a visible element with text
        cy.get('h1, h2, h3, p').filter(':visible').first().then(($el) => {
          const style = window.getComputedStyle($el[0]);
          expect(style.letterSpacing).to.equal('8px');
          
          const fontSize = parseFloat(style.fontSize);
          const lineHeight = parseFloat(style.lineHeight);
          // 2.5 * fontSize
          expect(lineHeight / fontSize).to.be.closeTo(2.5, 0.1);
        });
      });
    });
  });
});
