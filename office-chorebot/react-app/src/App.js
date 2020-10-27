import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Home } from "./components/Home";
import AppSignIn from "./components/SigninFirebase";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

export default class App extends Component {
  render() {
    return (
      <AuthProvider>
        <Router>
          <div>
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/signin" component={AppSignIn} />
          </div>
        </Router>
      </AuthProvider>
    );
  }
}
