import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { orderBurgerApi } from '../../utils/burger-api';

export interface IConstructorState {
  burgerConstructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  error: string | null;
}

const initialState: IConstructorState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  error: null
};

export const submitOrderThunk = createAsyncThunk<
  any,
  void,
  { state: { burgerConstructor: IConstructorState }; rejectValue: string }
>('burgerConstructor/submitOrder', async (_, { getState, rejectWithValue }) => {
  const { burgerConstructor } = getState().burgerConstructor;
  if (!burgerConstructor.bun) {
    return rejectWithValue('Нельзя оформить пустой заказ');
  }
  const ingredientIds = burgerConstructor.ingredients.map((item) => item.id);
  const orderIds = [
    burgerConstructor.bun.id,
    ...ingredientIds,
    burgerConstructor.bun.id
  ];
  return await orderBurgerApi(orderIds);
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burgerConstructor.bun = action.payload;
        } else {
          state.burgerConstructor.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    raiseIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.burgerConstructor.ingredients;
      if (index > 0 && index < ingredients.length) {
        const [movedIngredient] = ingredients.splice(index, 1);
        ingredients.splice(index - 1, 0, movedIngredient);
      }
    },
    lowerIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.burgerConstructor.ingredients;
      if (index >= 0 && index < ingredients.length - 1) {
        const [movedIngredient] = ingredients.splice(index, 1);
        ingredients.splice(index + 1, 0, movedIngredient);
      }
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },
    clearBurgerConstructor: (state) => {
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(submitOrderThunk.fulfilled, (state) => {
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    });
  }
});

export const constructorSelector = (state: {
  burgerConstructor: IConstructorState;
}) => state.burgerConstructor.burgerConstructor;

export const {
  addIngredient,
  raiseIngredient,
  lowerIngredient,
  deleteIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
