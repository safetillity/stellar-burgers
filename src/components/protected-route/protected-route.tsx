import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  isAuthCheckedSelector,
  loginUserRequestSelector
} from '../../services/slices/userSlice';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const isLoginInProgress = useSelector(loginUserRequestSelector);
  const location = useLocation();

  if (!isAuthChecked && isLoginInProgress) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthChecked) {
    const redirectTo = location.state?.from || { pathname: '/' };
    return <Navigate replace to={redirectTo} state={{ from: location }} />;
  }

  return children;
};
