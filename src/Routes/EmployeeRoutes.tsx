import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface EmployeeRouteProps {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
}

const EmployeeRoute: React.FC<EmployeeRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && role === 'employee' ? (
          <Component {...props} />
        ) : (
          <Redirect to="/menu-admin" />
        )
      }
    />
  );
};

export default EmployeeRoute;
