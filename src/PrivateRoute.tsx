import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "./logicHandlers/userServices";

const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => {
      const user = getCurrentUser();
      return user ? <Component {...props} /> : <Redirect to="/" />;
    }}
  />
);

export default PrivateRoute;