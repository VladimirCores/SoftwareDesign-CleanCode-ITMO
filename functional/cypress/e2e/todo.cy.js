import Dom from '../../src/consts/dom.js';
import DOM from '../../src/consts/dom.js';
import * as constants from 'constants';

describe('Test - todo creation - on index page ', () => {
  before(() => {
    cy.visit('http://127.0.0.1:8089');
  });

  const checkChildrenExist = () =>
    cy.get('#listOfTodos > li > input[type="checkbox"]').should('exist').should('have.length', 1);

  const createTodo = (text) => {
    cy.get('#inpTodoTitle').type(text);
    cy.get('#btnCreateTodo').click();
  };

  it('enter todo text as number and check disabled button', () => {
    cy.get(`#${Dom.INPUT_TODO_TITLE}`).type(123);
    cy.get('#btnCreateTodo').should('be.disabled');
    cy.get('#inpTodoTitle').clear();
  });

  it('enter todo text and press create', () => {
    const TEST_TODO_TEXT = 'New Todo';

    cy.checkInputExistAndEmpty();

    createTodo(TEST_TODO_TEXT);

    cy.checkInputExistAndEmpty();

    const todoListChildren = cy.get('#listOfTodos').children();

    todoListChildren.should('exist').should('have.length', 1);
    todoListChildren.first().should('contain.text', TEST_TODO_TEXT);

    checkChildrenExist();
    cy.reload(true);
    checkChildrenExist();
  });

  it('create todo and validate selection rules', () => {
    ['Todo 1', 'Todo 2', 'Todo 3'].forEach(createTodo);

    cy.get(`#${DOM.INPUT_TODO_TITLE}`).clear();

    const click_OnListItem_And_CheckInputValue_FromFunctionCall = (listItemIndex, getCompareValue) =>
      cy
        .get(`#${DOM.LIST_OF_TODOS}`)
        .children()
        .eq(listItemIndex)
        .click()
        .then(($child) => {
          cy.get(`#${DOM.INPUT_TODO_TITLE}`).should('have.value', getCompareValue($child));
        });

    const getTextFromTodoItemDomElement = ($child) => $child.text().trim();

    click_OnListItem_And_CheckInputValue_FromFunctionCall(0, getTextFromTodoItemDomElement)
      .then(() => {
        click_OnListItem_And_CheckInputValue_FromFunctionCall(0, () => '');
      })
      .then(() => {
        click_OnListItem_And_CheckInputValue_FromFunctionCall(1, getTextFromTodoItemDomElement);
      });

    // clickOnFirstListItem().then(($child) => {
    //   cy.get(`#${DOM.INPUT_TODO_TITLE}`).should('have.value', $child.text().trim());
    //   clickOnFirstListItem().then(($child) => {
    //     cy.get(`#${DOM.INPUT_TODO_TITLE}`).should('have.value', '');
    //   });
    // });
  });
});
