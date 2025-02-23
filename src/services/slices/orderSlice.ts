import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface OrderState {
  order: TOrder | null;
  isOrderLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  isOrderLoading: false,
  error: null
};

export const orderBurgerThunk = createAsyncThunk<{ order: TOrder }, string[]>(
  'orders/postOrderBurger',
  async (order: string[]) => orderBurgerApi(order)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.isOrderLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, { payload }) => {
        state.isOrderLoading = false;
        state.order = payload.order;
      })
      .addCase(orderBurgerThunk.rejected, (state, { error }) => {
        state.isOrderLoading = false;
        state.error =
          error.message || 'Добавьте  ингредиенты, чтобы оформить заказ';
      });
  }
});

export const clearOrder = orderSlice.actions.clearOrder;
export const isOrderLoadingSelector = (state: { order: OrderState }) =>
  state.order.isOrderLoading;
export const orderSelector = (state: { order: OrderState }) =>
  state.order.order;
export default orderSlice.reducer;
