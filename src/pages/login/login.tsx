import { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  clearErrors,
  errorSelector,
  loginUserThunk
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { LoginUI } from '@ui-pages';
import { useValue } from '../../hooks/useValue';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);
  const navigate = useNavigate();
  const location = useLocation();

  const { values, handleChange } = useValue({
    email: '',
    password: ''
  });
  const { from } = location.state || { from: { pathname: '/' } };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      loginUserThunk({ email: values.email, password: values.password })
    );
    navigate(from.pathname, { replace: true });
  };

  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  return (
    <LoginUI
      errorText={error!}
      email={values.email}
      password={values.password}
      setEmail={(e) => handleChange('email', e)}
      setPassword={(e) => handleChange('password', e)}
      handleSubmit={handleSubmit}
    />
  );
};
