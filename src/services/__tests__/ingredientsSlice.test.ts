import '@testing-library/jest-dom';
// ingredientsSlice.test.ts
import ingredientsReducer, {
  IngredientsState,
  getIngredientsThunk
} from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: Omit<TIngredient, '__v'>[] = [
  {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
  }
];

describe('ingredients reducer', () => {
  const initialState: IngredientsState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  it('should handle initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle getIngredientsThunk.pending', () => {
    const action = {
      type: getIngredientsThunk.pending.type
    };

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isIngredientsLoading: true,
      error: null
    });
  });

  it('should handle getIngredientsThunk.fulfilled', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      isIngredientsLoading: false,
      ingredients: mockIngredients
    });
  });

  it('should handle getIngredientsThunk.rejected with error message', () => {
    const errorMessage = 'Network Error';
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: { message: errorMessage }
    };

    const state = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      isIngredientsLoading: false,
      error: errorMessage
    });
  });

  it('should handle getIngredientsThunk.rejected without error message', () => {
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: {}
    };

    const state = ingredientsReducer(
      { ...initialState, isIngredientsLoading: true },
      action
    );

    expect(state).toEqual({
      ...initialState,
      isIngredientsLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
