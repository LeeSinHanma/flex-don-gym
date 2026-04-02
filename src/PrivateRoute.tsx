import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "./logicHandlers/userServices";

const PrivateRoute = ({ component: Component, requiredAccess, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => {
      const user = getCurrentUser();
      if (!user) return <Redirect to="/" />;

      const isAdmin = user.role === 0 || user.userType === 0;
      const accessList: string[] = user.accessList || [];

      if (requiredAccess && !isAdmin && !accessList.includes(requiredAccess)) {
        return <Redirect to="/" />;
      }

      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;