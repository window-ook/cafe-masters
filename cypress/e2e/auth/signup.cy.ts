describe('회원가입(OTP 입력 과정은 제외)', () => {
  before(() => {
    cy.visit('/');
    cy.window().then(win => {
      win.eval(`
          __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
            confirmationRequired: true,
          });
        `);
    });
  });

  it('회원가입 폼으로 뷰를 바꾸고, 이메일과 비밀번호를 입력하고 가입하기를 누른다.', () => {
    // actions
    cy.get('[data-cy=opensignup-button]').click();
    cy.get('[data-cy=email-input]').type('user@example.com');
    cy.get('[data-cy=password-input]').type('1234!abcd');
    cy.get('[data-cy=otp-signup-button]').click();
  });
});
