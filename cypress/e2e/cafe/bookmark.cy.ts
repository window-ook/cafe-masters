const { USERS } = require('../../fixtures');

describe('북마크', () => {
  beforeEach(() => {
    cy.visit('/');
    const user = USERS[0];
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=password-input]').type(user.password);
    cy.get('[data-cy=signin-button]').click();
    // assertion - 메인 레이아웃 확인
    cy.get('[data-cy=main-layout]').should('be.visible');
  });

  it('가고 싶은 카페 보기 버튼을 누르면, 북마크한 카페가 사이드바에 표시된다.', () => {
    cy.get('[data-cy=route-가고-싶은-카페-보기]').click();
    cy.url().should('include', '/cafe/bookmarked');
    // assertion - 가고 싶은 카페 확인
    cy.get('[data-cy=normal-cafe]').should('have.length.at.least', 1);
  });

  it('검색 결과의 첫번째 카페의 북마크 버튼을 누르면, 북마크 된다.', () => {
    cy.visit('/');
    cy.get('[data-cy=search-input]').clear();
    cy.get('[data-cy=search-input]').type('성수');
    cy.get('[data-cy=search-button]').click();
    cy.get('[data-cy=normal-cafe]').first().click();
    cy.url().should('include', '/cafe/all/detail');
    cy.get('[data-cy=upload-bookmark-button]').click();
    // assertion - 북마크 취소 버튼 확인
    cy.get('[data-cy=cancel-bookmark-button]').should('be.visible');
  });

  it('검색 결과의 첫번째 카페의 북마크 취소 버튼을 누르면, 북마크를 취소한다.', () => {
    cy.visit('/');
    cy.get('[data-cy=search-input]').clear();
    cy.get('[data-cy=search-input]').type('성수');
    cy.get('[data-cy=search-button]').click();
    cy.get('[data-cy=normal-cafe]').first().click();
    cy.get('[data-cy=cancel-bookmark-button]').click();
    cy.get('[data-cy=normal-cafe]').first().click();
    // assertion - 북마크 버튼 확인
    cy.get('[data-cy=upload-bookmark-button]').should('be.visible');
  });
});
