const { USERS } = require('../../fixtures');

describe('비밀번호 재설정', () => {
  before(() => {
    cy.visit('/');
  });

  it('로그인 화면에서 재설정 폼을 불러온 뒤, 이메일을 입력 후 재설정 링크를 받는다.', () => {
    // actions
    const user = USERS[0];
    cy.get('[data-cy=openreset-button]').click();
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=request-link-for-resetpassword-button]').click();

    // assertion
    cy.get('[data-cy=success-request-for-resetpassword]').should('be.visible');
  });
});
