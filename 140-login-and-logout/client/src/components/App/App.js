import React, { Component } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store";
import setAuthToken from "../../utils/setAuthToken";
import parseJwt from "../../utils/parseJWT";
import { setCurrentUser, logOutUser } from "../../actions/auth-actions";
import Navbar from "../layout/Navbar";
import Landing from "../layout/Landing";
import Footer from "../layout/Footer";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import "./App.css";

if (localStorage.jwtToken) {
  console.log("user is authenticated");
  const { jwtToken } = localStorage;
  setAuthToken(jwtToken);
  const decodedUser = parseJwt(jwtToken);
  store.dispatch(setCurrentUser(decodedUser));
  if (decodedUser.exp < Date.now() / 1000) {
    store.dispatch(logOutUser());
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <header>
              <Navbar />
            </header>
            <Route exact path="/" component={Landing} />
            <main>
              <div className="container">
                <Route path={"/register"} component={Register} />
                <Route path={"/login"} component={Login} />
              </div>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
