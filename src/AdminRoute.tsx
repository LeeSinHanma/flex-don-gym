import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "./logicHandlers/userServices";

const AdminRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => {
      const user = getCurrentUser();
      if (!user) return <Redirect to="/" />;
      if (user.userType !== 1) return <Redirect to="/qr" />; // not admin
      return <Component {...props} />;
    }}
  />
);

export default AdminRoute;