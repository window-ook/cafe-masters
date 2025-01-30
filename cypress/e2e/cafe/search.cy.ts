const { USERS } = require('../../fixtures');

describe('카카오맵 API Fetching', () => {
  before(() => {
    cy.visit('/');
    const user = USERS[0];
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=password-input]').type(user.password);
    cy.get('[data-cy=signin-button]').click();
    cy.get('[data-cy=main-layout]').should('be.visible');
  });

  it('인풋창에 키워드를 검색하면, /cafe/all로 이동 후 결과들이 사이드바에 표시된다.', () => {
    cy.get('[data-cy=search-input]').clear();
    cy.get('[data-cy=search-input]').type('안국역');
    cy.get('[data-cy=search-button]').click();
    cy.url().should('include', '/cafe/all');
    cy.get('[data-cy=normal-cafe]').should('have.length.at.least', 1);
  });
});
