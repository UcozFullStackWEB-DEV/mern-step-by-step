import React, { Component } from "react";
import { connect } from "react-redux";
import { userLogin } from "../../actions/auth-actions";
import { withRouter } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
  }

  onChange = e => {
    this.setState({
      //Computed field - input attr name="email"...
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentDidUpdate() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    let loginFields = {
      email,
      password
    };
    this.props.userLogin(loginFields);
  };

  render() {
    const { errors } = this.props;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={
                      errors.email
                        ? "form-control form-control-lg is-invalid"
                        : "form-control form-control-lg "
                    }
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {errors.email ? (
                    <span className="invalid-feedback">{errors.email}</span>
                  ) : null}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    className={
                      errors.password
                        ? "form-control form-control-lg is-invalid"
                        : "form-control form-control-lg"
                    }
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password
                    ? React.createElement(
                        "span",
                        { className: "invalid-feedback" },
                        errors.password
                      )
                    : null}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.errors,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLogin: loginInputs => dispatch(userLogin(loginInputs))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login));
