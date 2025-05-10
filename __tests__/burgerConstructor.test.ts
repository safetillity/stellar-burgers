import {
  addIngredient,
  raiseIngredient,
  lowerIngredient,
  deleteIngredient,
  clearBurgerConstructor
} from '../src/services/slices/burgerConstructorSlice';
import reducer from '../src/services/slices/burgerConstructorSlice';

const bunMock = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  __v: 0,
  id: '341212341234'
};

const ingredient1Mock = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '433434234234',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

const ingredient2Mock = {
  _id: '643d69a5c3f7b9001cfa0944',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
  __v: 0,
  id: '4334332423435'
};

describe('тест burgerConstructorSlice', () => {
  describe('тест работы с булками', () => {
    test('установка булкы через addIngredient (тип "bun")', () => {
      const state = reducer(undefined, addIngredient(bunMock));
      const { id: _, ...bunFromState } = state.burgerConstructor.bun!;
      const { id: __, ...expectedBun } = bunMock;
      expect(bunFromState).toEqual(expectedBun);
      expect(state.burgerConstructor.ingredients).toHaveLength(0);
    });
  });

  describe('тест операций с ингредиентами', () => {
    test('добавление ингредиента через addIngredient', () => {
      const state = reducer(undefined, addIngredient(ingredient1Mock));
      expect(state.burgerConstructor.ingredients).toHaveLength(1);
      const { id: _, ...ingredientFromState } =
        state.burgerConstructor.ingredients[0];
      const { id: __, ...expectedIngredient } = ingredient1Mock;
      expect(ingredientFromState).toEqual(expectedIngredient);
      expect(state.burgerConstructor.bun).toBeNull();
    });

    test('удаление ингредиента через deleteIngredient', () => {
      const initialState = {
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1Mock, ingredient2Mock]
        },
        error: null
      };
      const state = reducer(initialState, deleteIngredient(ingredient1Mock));
      expect(state.burgerConstructor.ingredients).toHaveLength(1);
      expect(state.burgerConstructor.ingredients[0]).toEqual(ingredient2Mock);
      expect(state.burgerConstructor.bun).toBeNull();
    });
  });

  describe('тест изменения порядка ингредиентов', () => {
    test('перемещение ингредиента вверх ', () => {
      const initialState = {
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1Mock, ingredient2Mock]
        },
        error: null
      };
      const state = reducer(initialState, raiseIngredient(1));
      expect(state.burgerConstructor.ingredients).toEqual([
        ingredient2Mock,
        ingredient1Mock
      ]);
    });

    test('перемещение ингредиент вниз ', () => {
      const initialState = {
        burgerConstructor: {
          bun: null,
          ingredients: [ingredient1Mock, ingredient2Mock]
        },
        error: null
      };
      const state = reducer(initialState, lowerIngredient(0));
      expect(state.burgerConstructor.ingredients).toEqual([
        ingredient2Mock,
        ingredient1Mock
      ]);
    });
  });

  test('очистка конструктора через clearBurgerConstructor', () => {
    const initialState = {
      burgerConstructor: {
        bun: bunMock,
        ingredients: [ingredient1Mock, ingredient2Mock]
      },
      error: null
    };
    const state = reducer(initialState, clearBurgerConstructor());
    expect(state.burgerConstructor.ingredients).toHaveLength(0);
    expect(state.burgerConstructor.bun).toBeNull();
  });

  test('сброс конструктора после успешного заказа', () => {
    const initialState = {
      burgerConstructor: {
        bun: bunMock,
        ingredients: [ingredient1Mock, ingredient2Mock]
      },
      error: null
    };
    const action = { type: 'burgerConstructor/submitOrder/fulfilled' };
    const state = reducer(initialState, action);
    expect(state.burgerConstructor.ingredients).toHaveLength(0);
    expect(state.burgerConstructor.bun).toBeNull();
    expect(state.error).toBeNull();
  });
});
