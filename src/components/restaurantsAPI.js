import React, { Component } from "react";

class RestaurantsNearbyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantsNearby: this.props.restaurantsNearby
    };
  }

 render() {
    return (
      <div>
        <ul>
          {this.state.restaurantsNearby.map(restaurant => (
            <li key={restaurant.name}>
              {restaurant.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default RestaurantsNearbyCard;