import reducer, {
  clearOrder,
  orderBurgerThunk
} from '../src/services/slices/orderSlice';
import { OrderState } from '../src/services/slices/orderSlice';

const initialState: OrderState = {
  order: null,
  isOrderLoading: false,
  error: null
};

const orderMockResponse = {
  order: {
    ingredients: [
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa094d'
    ],
    _id: '67d0caa7133acd001be572d1',
    owner: {
      name: '123321',
      email: 'zafetillity@gmail.com',
      createdAt: '2025-02-22T21:30:56.419Z',
      updatedAt: '2025-02-22T21:30:56.419Z'
    },
    status: 'done',
    name: 'Space флюоресцентный люминесцентный бургер',
    createdAt: '2025-03-11T23:43:35.741Z',
    updatedAt: '2025-03-11T23:43:36.443Z',
    number: 70732,
    price: 3044
  }
};

describe('тест orderSlice', () => {
  describe('тест clearOrder', () => {
    test('сбрасывание состояние заказа к начальному', () => {
      const prevState: OrderState = {
        order: orderMockResponse.order,
        isOrderLoading: true,
        error: 'Ошибка'
      };

      const state = reducer(prevState, clearOrder());
      expect(state.order).toBeNull();
      expect(state.isOrderLoading).toBeFalsy();
      expect(state.error).toBeNull();
    });
  });

  describe('тест orderBurgerThunk', () => {
    test('установка isOrderLoading в true и сброс error при pending', () => {
      const action = { type: orderBurgerThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.isOrderLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('сохранение заказа и сброс isOrderLoading при fulfilled', () => {
      const action = {
        type: orderBurgerThunk.fulfilled.type,
        payload: orderMockResponse
      };
      const state = reducer(initialState, action);

      expect(state.isOrderLoading).toBeFalsy();
      expect(state.order).toEqual(orderMockResponse.order);
    });

    test('сохранение ошибки и сброс isOrderLoading при rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: orderBurgerThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);

      expect(state.isOrderLoading).toBeFalsy();
      expect(state.error).toEqual(errorMessage);
    });
  });
});
