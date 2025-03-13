import reducer, {
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  getUserThunk,
  updateUserThunk,
  getOrdersThunk,
  clearErrors
} from '../src/services/slices/userSlice';
import { UserState } from '../src/services/slices/userSlice';

const initialState: UserState = {
  isAuthenticated: false,
  loginUserRequest: false,
  user: null,
  orders: [],
  ordersRequest: false,
  error: null
};

const userMockData = {
  email: 'example@example.mail',
  name: 'Example'
};

const updatedUserMockData = {
  email: 'updated@example.mail',
  name: 'Updated'
};

const ordersMockData = [
  { orderId: '12345', status: 'done' },
  { orderId: '67890', status: 'pending' }
];

describe('тест userSlice', () => {
  describe('тест registerUserThunk', () => {
    test('изменеие loginUserRequest в true, isAuthenticated = false, сброс error при pending', () => {
      const action = { type: registerUserThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.loginUserRequest).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('сохранение пользователя, изменение isAuthenticated в true и сброс loginUserRequest при fulfilled', () => {
      const action = {
        type: registerUserThunk.fulfilled.type,
        payload: userMockData
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(userMockData);
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.loginUserRequest).toBeFalsy();
    });

    test('сохранение сообщение об ошибке и сброс loginUserRequest при rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: registerUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.loginUserRequest).toBeFalsy();
      expect(state.error).toEqual(errorMessage);
    });
  });

  describe('loginUserThunk', () => {
    test('изменеие loginUserRequest в true, сброс error pending ', () => {
      const action = { type: loginUserThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.loginUserRequest).toBeTruthy();
      expect(state.error).toBeNull();
    });

    test('сохранение пользователя, установка isAuthenticated в true и сброс loginUserRequest при fulfilled', () => {
      const action = {
        type: loginUserThunk.fulfilled.type,
        payload: userMockData
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(userMockData);
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.loginUserRequest).toBeFalsy();
    });

    test('сохранение сообщение об ошибке и сброс login при rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: loginUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);
      expect(state.loginUserRequest).toBeFalsy();
      expect(state.error).toEqual(errorMessage);
    });
  });

  describe('logoutUserThunk', () => {
    test('сброс пользователя и флаг авторизации при pending', () => {
      const prevState: UserState = {
        ...initialState,
        user: userMockData,
        isAuthenticated: true
      };
      const action = { type: logoutUserThunk.pending.type };
      const state = reducer(prevState, action);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.loginUserRequest).toBeFalsy();
    });
  });

  describe('тест getUserThunk', () => {
    test('изменение loginUserRequest в true при pending', () => {
      const action = { type: getUserThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.loginUserRequest).toBeTruthy();
    });

    test('сохраняет данные пользователя и изменение isAuthenticated в true при fulfilled', () => {
      const action = {
        type: getUserThunk.fulfilled.type,
        payload: { user: userMockData }
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(userMockData);
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.loginUserRequest).toBeFalsy();
    });

    test('сброс данные пользователя, loginUserRequest и сохранение ошибки при  rejected', () => {
      const errorMessage = 'Ошибка получения данных пользователя';
      const action = {
        type: getUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);
      expect(state.user).toBeNull();
      expect(state.loginUserRequest).toBeFalsy();
      expect(state.error).toEqual(errorMessage);
    });
  });

  describe('тестupdateUserThunk', () => {
    test('изменение loginUserRequest в true пр pending', () => {
      const action = { type: updateUserThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.loginUserRequest).toBeTruthy();
    });

    test('обновление данных пользователя и изменение isAuthenticated в true при fulfilled', () => {
      const action = {
        type: updateUserThunk.fulfilled.type,
        payload: { user: updatedUserMockData }
      };
      const state = reducer(initialState, action);
      expect(state.user).toEqual(updatedUserMockData);
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.loginUserRequest).toBeFalsy();
    });

    test('сохранение сообщение об ошибке и сброс loginUserRequest пр rejected', () => {
      const errorMessage = 'Ошибка обновления данных';
      const action = {
        type: updateUserThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);
      expect(state.loginUserRequest).toBeFalsy();
      expect(state.error).toEqual(errorMessage);
    });
  });

  describe('тест getOrdersThunk', () => {
    test('изменение ordersRequest в true при pending', () => {
      const action = { type: getOrdersThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.ordersRequest).toBeTruthy();
    });

    test('сохранянение заказов и сброс ordersRequest при fulfilled', () => {
      const action = {
        type: getOrdersThunk.fulfilled.type,
        payload: ordersMockData
      };
      const state = reducer(initialState, action);
      expect(state.orders).toEqual(ordersMockData);
      expect(state.ordersRequest).toBeFalsy();
    });

    test('сохранение сообщение об ошибке и сброс ordersRequest при rejected', () => {
      const errorMessage = 'Ошибка получения заказов';
      const action = {
        type: getOrdersThunk.rejected.type,
        error: { message: errorMessage }
      };
      const state = reducer(initialState, action);
      expect(state.ordersRequest).toBeFalsy();
      expect(state.error).toEqual(errorMessage);
    });
  });

  describe('тест очистки поля error', () => {
    test('очистка поля error', () => {
      const prevState: UserState = {
        ...initialState,
        error: 'Some error'
      };
      const state = reducer(prevState, clearErrors());
      expect(state.error).toBeNull();
    });
  });
});
