import React, { Component } from "react";
import { connect } from "react-redux";
import { userRegister } from "../../actions/auth-actions";
import { withRouter } from "react-router-dom";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, email, password, password2 } = this.state;
    let newUser = {
      name,
      email,
      password,
      password2
    };
    this.props.userRegister(newUser, this.props.history);
    // this.props.userRegister(newUser, this.props.history);
  };

  componentWillReceiveProps(nextProps) {
    const { errors } = nextProps;
    if (errors) {
      this.setState({ errors });
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={
                      errors.name
                        ? "form-control form-control-lg is-invalid"
                        : "form-control form-control-lg"
                    }
                    placeholder="Name"
                    name="name"
                    required
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                  {errors.name ? (
                    <span className="invalid-feedback">{errors.name}</span>
                  ) : null}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={
                      errors.email
                        ? "form-control form-control-lg is-invalid"
                        : "form-control form-control-lg"
                    }
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {errors.email ? (
                    <span className="invalid-feedback">{errors.email}</span>
                  ) : null}

                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
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
                  {errors.password ? (
                    <span className="invalid-feedback">{errors.password}</span>
                  ) : null}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={
                      errors.password2
                        ? "form-control form-control-lg is-invalid"
                        : "form-control form-control-lg"
                    }
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                  />
                  {errors.password2 ? (
                    <span className="invalid-feedback">{errors.password2}</span>
                  ) : null}
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
    auth: state.auth,
    errors: state.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userRegister: (userInfo, history) => {
      //dispatch ( dispatch => axios.post....)(dispatch)
      dispatch(userRegister(userInfo, history));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));
