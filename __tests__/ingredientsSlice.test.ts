import ingredientsReducer, {
  IngredientsState,
  getIngredientsThunk
} from '../src/services/slices/ingredientsSlice';
import { TIngredient } from '../src/utils/types';

const mockIngredients: TIngredient[] = [
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

describe('тест ingredientsSlice', () => {
  const initialState: IngredientsState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  it('проверка initialState', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('изменение состояния при pending', () => {
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

  it('изменение состояния при fulfilled', () => {
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

  it('изменение состояния при rejected с сообщением ошибки', () => {
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

  it('изменение состояния при rejected без сообщения ошибки', () => {
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
