describe('비밀번호 재설정', () => {
  before(() => {
    cy.visit('/');
  });

  it('로그인 화면에서 재설정 폼을 불러온 뒤, 이메일을 입력 후 재설정 링크를 받는다.', () => {
    // actions
    cy.get('[data-cy=openreset-button]').click();
    cy.get('[data-cy=resetpassword-email-input]').type('testuser@example.com');
    cy.get('[data-cy=request-link-for-resetpassword-button]').click();

    // assertion
    cy.get('[data-cy=success-request-for-resetpassword]').should('be.visible');
  });
});
