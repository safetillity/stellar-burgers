import '@testing-library/jest-dom';
// store.test.ts
import { UnknownAction } from '@reduxjs/toolkit';
import { rootReducer } from '../store';
import burgerConstructor from '../slices/burgerConstructorSlice';
import feeds from '../slices/feedsSlice';
import ingredients from '../slices/ingredientsSlice';
import order from '../slices/orderSlice';
import user from '../slices/userSlice';

describe('тест инициализации rootReducer', () => {
  it('комбайнинг слайсов', () => {
    const dummyAction: UnknownAction = { type: 'unknown' };

    const expectedState = {
      burgerConstructor: burgerConstructor(undefined, dummyAction),
      feeds: feeds(undefined, dummyAction),
      ingredients: ingredients(undefined, dummyAction),
      order: order(undefined, dummyAction),
      user: user(undefined, dummyAction)
    };

    const initialState = rootReducer(undefined, dummyAction);

    expect(initialState).toEqual(expectedState);
  });

  it('совпадение значений', () => {
    const dummyAction: UnknownAction = { type: 'unknown' };
    const initialState = rootReducer(undefined, dummyAction);

    expect(Object.keys(initialState)).toEqual([
      'burgerConstructor',
      'feeds',
      'ingredients',
      'order',
      'user'
    ]);
  });
});
