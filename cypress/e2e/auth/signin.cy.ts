const { USERS } = require('../../fixtures');

describe('로그인', () => {
  before(() => {
    cy.visit('/');
  });

  it('이메일과 비밀번호를 입력하고 클릭하면 로그인 되고, 메인 레이아웃이 나타난다.', () => {
    const user = USERS[0];
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=password-input]').type(user.password);
    cy.get('[data-cy=signin-button]').click();

    // assertion - 메인 레이아웃 확인
    cy.get('[data-cy=main-layout]').should('be.visible');
  });
});
