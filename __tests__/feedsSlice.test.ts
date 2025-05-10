import reducer, {
  getFeedsThunk,
  getOrderThunk
} from '../src/services/slices/feedsSlice';

const mockFeedsResponse = {
  orders: [],
  total: 10,
  totalToday: 5
};

const mockOrderResponse = {
  orders: [{ id: 1, name: 'Burger' }]
};

describe('тест feedsSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(
      reducer(undefined, { type: 'unknown' })
    );
  });

  describe('обработка действий getFeedsThunk', () => {
    it('изменяет состояние при pending', () => {
      const action = { type: getFeedsThunk.pending.type };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        ...reducer(undefined, { type: 'unknown' }),
        isFeedsLoading: true,
        error: null
      });
    });

    it('изменяет состояние при fulfilled', () => {
      const action = {
        type: getFeedsThunk.fulfilled.type,
        payload: mockFeedsResponse
      };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        ...reducer(undefined, { type: 'unknown' }),
        isFeedsLoading: false,
        orders: mockFeedsResponse.orders,
        total: mockFeedsResponse.total,
        totalToday: mockFeedsResponse.totalToday
      });
    });

    it('изменяет состояние при rejected', () => {
      const errorText = 'Ошибка загрузки заказов';
      const action = {
        type: getFeedsThunk.rejected.type,
        error: { message: errorText }
      };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        ...reducer(undefined, { type: 'unknown' }),
        isFeedsLoading: false,
        error: errorText
      });
    });
  });

  describe('обработка действий getOrderThunk', () => {
    it('изменяет состояние при pending', () => {
      const action = { type: getOrderThunk.pending.type };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        ...reducer(undefined, { type: 'unknown' }),
        isOrderLoading: true,
        error: null
      });
    });

    it('изменяет состояние при fulfilled', () => {
      const action = {
        type: getOrderThunk.fulfilled.type,
        payload: mockOrderResponse
      };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        ...reducer(undefined, { type: 'unknown' }),
        isOrderLoading: false,
        order: mockOrderResponse.orders[0]
      });
    });

    it('изменяет состояние при rejected', () => {
      const errorText = 'Ошибка получения заказа';
      const action = {
        type: getOrderThunk.rejected.type,
        error: { message: errorText }
      };
      const state = reducer(undefined, action);

      expect(state).toEqual({
        ...reducer(undefined, { type: 'unknown' }),
        isOrderLoading: false,
        error: errorText
      });
    });
  });
});
