const { USERS } = require('../../fixtures');

describe('카카오맵 API', () => {
  beforeEach(() => {
    cy.visit('/');
    const user = USERS[0];
    cy.get('[data-cy=email-input]').type(user.email);
    cy.get('[data-cy=password-input]').type(user.password);
    cy.get('[data-cy=signin-button]').click();
    // assertion - 메인 레이아웃 확인
    cy.get('[data-cy=main-layout]').should('be.visible');
  });

  it('인풋창에 키워드를 검색하면, 검색 결과들이 사이드바에 표시된다.', () => {
    cy.get('[data-cy=search-input]').clear();
    cy.get('[data-cy=search-input]').type('안국역');
    cy.get('[data-cy=search-button]').click();
    // assertion - 검색 결과 확인
    cy.get('[data-cy=normal-cafe]').should('have.length.at.least', 1);
  });

  it('상세 정보의 썸네일을 클릭하면, 카카오 플레이스로 이동한다.', () => {
    cy.get('[data-cy=search-input]').clear();
    cy.get('[data-cy=search-input]').type('성수');
    cy.get('[data-cy=search-button]').click();
    cy.get('[data-cy=normal-cafe]').first().click();
    cy.window().then(win => cy.spy(win, 'open').as('windowOpen'));
    cy.get('[data-cy=normal-detail-thumbnail]').click();
    // assertion - 새 탭에서 카카오 플레이스 페이지 확인
    cy.get('@windowOpen')
      .should('be.called')
      .and('be.calledWithMatch', 'http://place.map.kakao.com');
  });
});
