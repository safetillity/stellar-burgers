import { FC, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  constructorSelector,
  clearBurgerConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  clearOrder,
  isOrderLoadingSelector,
  orderBurgerThunk,
  orderSelector
} from '../../services/slices/orderSlice';
import { isAuthCheckedSelector } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(constructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderSelector);
  const isAuthenticated = useSelector(isAuthCheckedSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const closeOrderModal = useCallback(() => {
    navigate('/', { replace: true });
    dispatch(clearBurgerConstructor());
    dispatch(clearOrder());
  }, [navigate, dispatch]);

  const onOrderClick = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const { bun, ingredients } = constructorItems;
    if (!bun || orderRequest) return;

    const orderData: string[] = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    dispatch(orderBurgerThunk(orderData));
  }, [isAuthenticated, constructorItems, orderRequest, dispatch, navigate]);

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
