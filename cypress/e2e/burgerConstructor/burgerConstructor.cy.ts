import * as orderFixture from '../../fixtures/order.json';

const BUN_SELECTOR = '[data-testid="ingredient-bun"]';
const MAIN_SELECTOR = '[data-testid="ingredient-main"]';
const SAUCE_SELECTOR = '[data-testid="ingredient-sauce"]';
const MODAL_ROOT = '[data-testid="modal-root"]';
const MODAL_CLOSE_BUTTON = '[data-testid="modal-close-button"]';
const ORDER_BUTTON = '[data-testid="order-button"]';

describe('тест конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients').then((interception) => {
      assert.isNotNull(interception.response?.body, 'Ingredients loaded');
    });
  });

  it('список ингридиентов', () => {
    cy.get(BUN_SELECTOR).should('have.length.at.least', 1);
    cy.get(`${MAIN_SELECTOR}, ${SAUCE_SELECTOR}`).should(
      'have.length.at.least',
      2
    );
  });

  describe('тест модальных окон ингридиентов', () => {
    it('открытие модального окна ингридиента', () => {
      cy.get(BUN_SELECTOR).first().click();
      cy.get(MODAL_ROOT).should('exist');
      cy.get('[data-testid="ingredient-details-name"]').should('be.visible');
    });

    describe('тест закрытия модального окна', () => {
      beforeEach(() => {
        cy.get(BUN_SELECTOR).first().click();
      });

      it('нажатие на кнопку закрытия', () => {
        cy.get(MODAL_CLOSE_BUTTON).click();
        cy.get(MODAL_ROOT).should('not.exist');
      });

      it('нажатие на оверлей', () => {
        cy.get('[data-testid="modal-overlay"]').click({ force: true });
        cy.get(MODAL_ROOT).should('not.exist');
      });

      it('нажатие на esc', () => {
        cy.get('body').type('{esc}');
        cy.get(MODAL_ROOT).should('not.exist');
      });
    });
  });

  describe('тест заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' }).as('getUser');
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'postOrder'
      );
      cy.visit('/');
      cy.wait('@getUser');
    });

    it('модальное окна заказа', () => {
      cy.get(`${BUN_SELECTOR}:first-of-type button`).scrollIntoView().click();
      cy.get(`${MAIN_SELECTOR}:first-of-type button`).scrollIntoView().click();
      cy.get(`${SAUCE_SELECTOR}:first-of-type button`).scrollIntoView().click();

      cy.get(ORDER_BUTTON).should('be.enabled').click();
      cy.wait('@postOrder');

      cy.get(MODAL_ROOT, { timeout: 10000 }).should('be.visible');
      cy.get(MODAL_ROOT)
        .find('[data-testid="order-number"]')
        .invoke('text')
        .should('eq', orderFixture.order.number.toString());

      cy.get(MODAL_CLOSE_BUTTON).click();
    });
    it('очищение конструктора', () => {
      cy.get('[data-testid="burger-constructor"]').should(
        'contain',
        'Выберите булки'
      );
    });
  });
});
