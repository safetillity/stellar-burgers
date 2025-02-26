import React, { useEffect, useCallback, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  Profile,
  ProfileOrders,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound404
} from '@pages';
import '../../index.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { getIngredientsThunk } from '../../services/slices/ingredientsSlice';
import { getUserThunk } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getUserThunk());
  }, [dispatch]);

  const handleCloseModal = useCallback(() => navigate(-1), [navigate]);

  const renderMainRoutes = () => (
    <Routes location={backgroundLocation || location}>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='/feed/:number' element={<OrderInfo />} />
      <Route
        path='/login'
        element={
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path='/register'
        element={
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <ProtectedRoute onlyUnAuth>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <ProtectedRoute onlyUnAuth>
            <ResetPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>
        }
      />
      <Route path='/ingredients/:id' element={<IngredientDetails />} />
      <Route path='*' element={<NotFound404 />} />
    </Routes>
  );

  const renderModalRoutes = () => (
    <Routes>
      <Route
        path='/feed/:number'
        element={
          <Modal title='Информация о заказе' onClose={handleCloseModal}>
            <OrderInfo />
          </Modal>
        }
      />
      <Route
        path='/ingredients/:id'
        element={
          <Modal title='Детали ингредиента' onClose={handleCloseModal}>
            <IngredientDetails />
          </Modal>
        }
      />
      <Route
        path='/profile/orders/:number'
        element={
          <Modal title='Информация о заказе' onClose={handleCloseModal}>
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          </Modal>
        }
      />
    </Routes>
  );

  return (
    <div className={styles.app}>
      <Suspense fallback={<Preloader />}>
        <AppHeader />
        {renderMainRoutes()}
        {backgroundLocation && renderModalRoutes()}
      </Suspense>
    </div>
  );
};

export default App;
