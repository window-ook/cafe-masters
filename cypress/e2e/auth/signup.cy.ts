describe('회원가입(OTP 입력 과정은 제외)', () => {
  before(() => {
    cy.visit('/');
  });

  it('이메일과 비밀번호를 입력하고 가입하기를 누르면, 인증 코드가 발송된다.', () => {
    cy.get('[data-cy=open-signup-button]').click();
    cy.get('[data-cy=email-input]').type('signup@test.com');
    cy.get('[data-cy=password-input]').type('1234!signup');
    cy.get('[data-cy=otp-signup-button]').click();
    // assertion - '인증 코드' 타이틀 확인
    cy.get('[data-cy=otp-title]').should('be.visible');
  });
});
