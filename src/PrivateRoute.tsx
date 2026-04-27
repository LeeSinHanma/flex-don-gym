import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "./logicHandlers/userServices";

const PrivateRoute = ({ component: Component, requiredAccess, requiredAdmin, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => {
      const user = getCurrentUser();
      if (!user) return <Redirect to="/" />;

      const isAdmin = user.role === 0 || user.userType === 0;
      const rawAccessList = Array.isArray(user.accessList)
        ? user.accessList
        : Array.isArray(user.access_list)
          ? user.access_list
          : [];

      const accessList: string[] = rawAccessList.map((item: string) =>
        String(item).trim().toLowerCase(),
      );
      const normalizedRequiredAccess =
        typeof requiredAccess === "string"
          ? requiredAccess.trim().toLowerCase()
          : requiredAccess;

      if (requiredAdmin && !isAdmin) {
        return <Redirect to="/" />;
      }

      if (
        normalizedRequiredAccess &&
        !isAdmin &&
        !accessList.includes(normalizedRequiredAccess)
      ) {
        return <Redirect to="/" />;
      }

      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
