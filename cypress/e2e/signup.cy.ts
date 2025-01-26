describe('회원가입 폼', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.window().then(win => {
      win.eval(`
          __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
            confirmationRequired: true,
            otp: '123456',
          });
        `);
    });
  });

  it('회원가입 테스트', () => {
    cy.get('[data-cy="opensignup-button"]').click();
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('password');
    cy.get('[data-cy="otp-signup-button"]').should('exist');
    cy.get('[data-cy="otp-signup-button"]').click();
    // otp 제출까지
  });

  it('카카오 로그인 테스트', () => {
    cy.get('[data-cy="kakaosignin-button"]').click();
  });
});
