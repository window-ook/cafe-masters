describe('로그인 폼', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('로그인 테스트', () => {
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('password');
    cy.get('[data-cy="signin-button"]').click();
  });

  it('비밀번호 재설정 폼 열기', () => {
    cy.get('[data-cy="openreset-button"]').click();
  });

  it('카카오 로그인 테스트', () => {
    cy.get('[data-cy="kakaosignin-button"]').click();
  });
});
