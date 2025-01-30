const { USERS } = require('../../fixtures');

describe('수집', () => {
  beforeEach(() => {
    cy.visit('/');
    const user = USERS[0];
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=password-input]').type(user.password);
    cy.get('[data-cy=signin-button]').click();
    cy.get('[data-cy=main-layout]').should('be.visible');
  });

  it('수집한 카드 보기 버튼을 누르면 /cafe/collected로 이동 후 수집한 카드가 사이드바에 표시된다.', () => {
    cy.get('[data-cy=route-수집한-카드-보기]').click();
    cy.url().should('include', '/cafe/collected');
    cy.get('[data-cy=collected-cafe]').should('have.length.at.least', 1);
  });

  it('검색 결과의 한 카페 상세 정보 페이지에서 수집하기를 누르고 정보를 입력한 뒤 카드를 수집한다.', () => {
    cy.visit('/');
    cy.get('[data-cy=search-input]').clear();
    cy.get('[data-cy=search-input]').type('이대역');
    cy.get('[data-cy=search-button]').click();
    cy.url().should('include', '/cafe/all');
    cy.get('[data-cy=normal-cafe]').first().click();
    cy.url().should('include', '/cafe/all/detail');
    cy.get('[data-cy=collect-button]').click();
    cy.get('[data-cy=memo-comment]').type('테스트 코멘트입니다.');
    cy.get('[data-cy=memo-pros]').type('테스트 좋은 점입니다.');
    cy.get('[data-cy=memo-cons]').type('테스트 별로인 점입니다.');
    cy.get('[data-cy=memo-eaten]').type('테스트 먹은 메뉴입니다.');
    cy.get('[data-cy=memo-concept]').type('테스트 카페 컨셉입니다.');
    cy.get('[data-cy=memo-button]').click();
  });

  it('수집한 카드의 내용을 수정하고 저장합니다.', () => {
    cy.visit('/cafe/collected');
    cy.get('[data-cy=collected-cafe]').first().click();
    cy.get('[data-cy=update-button]').click();
    cy.get('[data-cy=memo-comment]').clear();
    cy.get('[data-cy=memo-comment]').type('테스트 수정 코멘트입니다.');
    cy.get('[data-cy=memo-button]').click();
  });
});
