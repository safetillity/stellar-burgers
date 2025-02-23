import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TOrder, TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isAuthenticated: boolean;
  loginUserRequest: boolean;
  user: TUser | null;
  orders: TOrder[];
  ordersRequest: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  loginUserRequest: false,
  user: null,
  orders: [],
  ordersRequest: false,
  error: null
};

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }: TLoginData) => {
    try {
      const { refreshToken, accessToken, user } = await loginUserApi({
        email,
        password
      });
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка авторизации');
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    try {
      const { refreshToken, accessToken, user } = await registerUserApi({
        email,
        name,
        password
      });
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка регистрации');
    }
  }
);

export const logoutUserThunk = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

export const getUserThunk = createAsyncThunk('users/getUser', async () => {
  try {
    return await getUserApi();
  } catch (error: any) {
    throw new Error(error.message || 'Ошибка получения данных пользователя');
  }
});

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (userData: Partial<TRegisterData>) => {
    try {
      return await updateUserApi(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка обновления данных пользователя');
    }
  }
);

export const getOrdersThunk = createAsyncThunk(
  'users/getUserOrders',
  async () => {
    try {
      return await getOrdersApi();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка получения заказов');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthenticated,
    loginUserRequestSelector: (state) => state.loginUserRequest,
    userSelector: (state) => state.user,
    userNameSelector: (state) => state.user?.name || '',
    userEmailSelector: (state) => state.user?.email || '',
    userOrdersSelector: (state) => state.orders,
    ordersRequestSelector: (state) => state.ordersRequest,
    errorSelector: (state) => state.error
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.user = null;
        state.loginUserRequest = false;
        state.isAuthenticated = false;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.user = null;
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка получения данных';
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.ordersRequest = true;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка получения заказов';
        state.ordersRequest = false;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersRequest = false;
      });
  }
});

export const { clearErrors } = userSlice.actions;
export const {
  isAuthCheckedSelector,
  loginUserRequestSelector,
  userSelector,
  userNameSelector,
  userEmailSelector,
  userOrdersSelector,
  ordersRequestSelector,
  errorSelector
} = userSlice.selectors;
export default userSlice.reducer;
