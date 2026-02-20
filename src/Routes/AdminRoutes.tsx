import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && role === 'admin' ? (
          <Component {...props} />
        ) : (
          <Redirect to="/menu-admin" />
        )
      }
    />
  );
};

export default AdminRoute;
