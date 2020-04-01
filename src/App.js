import React, { Component } from "react";
import MapContainer from "./MapContainer";
import RestaurantsNearbyCard from "./components/restaurantsAPI";
import API_KEY from './API_KEY';

import axios from "axios";
import Grid from "@material-ui/core/Grid";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantsNearby: [],
      lat: null,
      lng: null
    };
  }
  _isMounted = false;

  componentDidMount() {
    this.getBrowserLocation()
      .then(position => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      })
      .then(() => {
        this.getNearbyPlaces();
      })
      .catch(err => {
        console.error(err.message);
      });
  }

  getBrowserLocation() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  getNearbyPlaces() {
    const radius = 500;
    const { lat, lng } = this.state;
    const newRestaurants = [];

    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${API_KEY}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000/"
          }
        }
      )
      .then(response => {
        response.data.results.map(item => {
          newRestaurants.push(item);
        });
        this.setState({
          restaurantsNearby: newRestaurants
        });
      });
  }

  render() {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item md={6}>
            <MapContainer 
              restaurantsNearby={this.state.restaurantsNearby}
              lat={this.state.lat} 
              lng={this.state.lng} 
              zoom={14} />
          </Grid>

          <Grid item md={6}>
            {this.state.restaurantsNearby.length > 1 ? (
              <RestaurantsNearbyCard
                restaurantsNearby={this.state.restaurantsNearby}
              />
            ) : (
              <div>loading</div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
