import React from 'react';
import './style.css';


class RegisterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        restaurantName: ''
      },
      restaurantName: '',
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);

  };

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.props.onRestaurantFormSubmit(this.state.fields)
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["restaurantName"]) {
      formIsValid = false;
      errors["restaurantName"] = "Please provide a name for the restaurant.";
    }
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  render() {
    return (
      <div id="main-registration-container">
        <div id="register">
          <h3>Add a new Restaurant !</h3>
          <form method="post" name="userRegistrationForm" onSubmit={this.submituserRegistrationForm} >
            <label>Restaurant Name</label>
            <input type="text" name="restaurantName" value={this.state.fields.restaurantName} onChange={this.handleChange} />
            <div className="errorMsg">{this.state.errors.restaurantName}</div>
            <input type="submit" className="button" value="Register" />
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;