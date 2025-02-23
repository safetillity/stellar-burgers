import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '@api';

export interface IngredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const getIngredientsThunk = createAsyncThunk<TIngredient[], void>(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
        state.isIngredientsLoading = false;
        state.ingredients = payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, { error }) => {
        state.isIngredientsLoading = false;
        state.error = error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const ingredientsSelector = (state: { ingredients: IngredientsState }) =>
  state.ingredients.ingredients;
export const isIngredientsLoadingSelector = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.isIngredientsLoading;

export default ingredientsSlice.reducer;
