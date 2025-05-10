import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface IFeedsState {
  isOrderLoading: boolean;
  total: number;
  totalToday: number;
  orders: TOrder[];
  isFeedsLoading: boolean;
  order: TOrder | null;
  error: string | null;
}

const initialState: IFeedsState = {
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  orders: [],
  isFeedsLoading: false,
  order: null,
  error: null
};

export const getFeedsThunk = createAsyncThunk('feeds/getFeeds', getFeedsApi);

export const getOrderThunk = createAsyncThunk(
  'orders/getOrder',
  getOrderByNumberApi
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, { payload }) => {
        state.isFeedsLoading = false;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      .addCase(getFeedsThunk.rejected, (state, { error }) => {
        state.isFeedsLoading = false;
        state.error = error.message || 'Ошибка загрузки заказов';
      })
      .addCase(getOrderThunk.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(getOrderThunk.fulfilled, (state, { payload }) => {
        state.isOrderLoading = false;
        state.order = payload.orders[0];
      })
      .addCase(getOrderThunk.rejected, (state, { error }) => {
        state.isOrderLoading = false;
        state.error = error.message || 'Failed to fetch order';
      });
  }
});

export const ordersSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.orders;
export const isFeedsLoadingSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.isFeedsLoading;
export const orderSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.order;
export const isOrderLoadingSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.isOrderLoading;
export const totalSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.total;
export const totalTodaySelector = (state: { feeds: IFeedsState }) =>
  state.feeds.totalToday;

export default feedsSlice.reducer;
