const { USERS } = require('../../fixtures');

describe('비밀번호 재설정', () => {
  before(() => {
    cy.visit('/');
  });

  it('이메일을 입력하고 버튼을 누르면, 재설정 링크를 받는다.', () => {
    const user = USERS[0];
    cy.get('[data-cy=open-reset-button]').click();
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=request-resetpassword-button]').click();

    // assertion - 재설정 링크 요청 성공 멘트 확인
    cy.get('[data-cy=success-request-resetpassword]').should('be.visible');
  });
});
