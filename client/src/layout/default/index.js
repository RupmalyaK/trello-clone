import React, { Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Aux from "../../hoc/_Aux";
import routes from "../../routes";
import config from "../../config";
import Loader from "../../components/Loader";
import "./app.scss";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {lightTheme,darkTheme} from "../../utils/theme.js";
const Layout = (props) => {
  const { email, id } = useSelector((state) => state.user);
  const history = useHistory();
  const currentTheme = useSelector(state => state.system.currentTheme);
  const theme = currentTheme === "light" ? lightTheme : darkTheme;
  
  useEffect(() => {
    if(!id)
      {
        history.push("/signin");
        return;
      }
   
  },[])

  const menu = routes.map((route, index) => {
    const { path, exact, name, authRequired, authLevel } = route;
   
    return route.component ? (
      <Route
        key={index}
        path={`${path}`}
        exact={exact}
        name={name}
        render={(props) => {
          return <route.component {...props} />;
        }}
      />
    ) : null;
  });

  return (
    <Aux>
      <div>
        <Suspense fallback={<Loader />}>
          <Switch>
            <ThemeProvider theme={theme}>
            {menu}
            </ThemeProvider>
            <Redirect from="/" to={config.defaultPath} />
          </Switch>
        </Suspense>
      </div>
    </Aux>
  );
};

export default Layout;
