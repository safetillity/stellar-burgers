import { UnknownAction } from '@reduxjs/toolkit';
import { rootReducer } from '../src/services/store';
import burgerConstructor from '../src/services/slices/burgerConstructorSlice';
import feeds from '../src/services/slices/feedsSlice';
import ingredients from '../src/services/slices/ingredientsSlice';
import order from '../src/services/slices/orderSlice';
import user from '../src/services/slices/userSlice';

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
