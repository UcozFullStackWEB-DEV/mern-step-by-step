import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

class Landing extends Component {
  render() {
    const { isAuthenticated } = this.props;
    const guestLinks = (
      <Fragment>
        <Link to={"/register"} className="btn btn-lg btn-info mr-2">
          Sign Up
        </Link>
        <Link to={"/login"} className="btn btn-lg btn-light">
          Login
        </Link>
      </Fragment>
    );

    const authLinks = (
      <Link className="btn btn-lg btn-light" to={"/dashboard"}>
        Dashboard
      </Link>
    );
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Developer Connector</h1>
                <p className="lead">
                  {" "}
                  Create a developer profile/portfolio, share posts and get help
                  from other developers
                </p>
                <hr />
                {isAuthenticated ? authLinks : guestLinks}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};
export default connect(mapStateToProps)(withRouter(Landing));
