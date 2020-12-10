import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import UsersPage from './user/pages/Users';
import NewPlacePage from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/contexts/auth-context';
import useAuth from './shared/hooks/auth-hooks';

function App() {
  const { login, logout, token, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route exact path="/">
          <UsersPage />
        </Route>
        <Route exact path="/:userId/places">
          <UserPlaces />
        </Route>
        <Route exact path="/places/new">
          <NewPlacePage />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/">
          <UsersPage />
        </Route>
        <Route exact path="/:userId/places">
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
