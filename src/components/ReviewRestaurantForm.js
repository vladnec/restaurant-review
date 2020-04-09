import React from 'react';


class ReviewRestaurantForm extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        authorName: '',
        review:''
      },
      authorName: '',
      review:'',
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

  };

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.props.onRestaurantRatingSubmit(this.state.fields)
    }
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["authorName"]) {
      formIsValid = false;
      errors["authorName"] = "Please provide a name for the restaurant.";
    }
    if (!fields["review"]) {
        formIsValid = false;
        errors["review"] = "Please provide a review for the restaurant.";
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
          <h3>Add a new review !</h3>
          <form method="post" name="userRegistrationForm" onSubmit={this.onFormSubmit} >
            <label>Name</label>
            <input type="text" name="authorName" value={this.state.fields.authorName} onChange={this.handleChange} />
            <div className="errorMsg">{this.state.errors.authorName}</div>
            
            <label>Write Here your Review</label>
            <input type="textarea" name="review" value={this.state.fields.review} onChange={this.handleChange} />
            <div className="errorMsg">{this.state.errors.review}</div>

            <input type="submit" className="button" value="Register" />
          </form>
        </div>
      </div>
    );
  }
}

export default ReviewRestaurantForm;