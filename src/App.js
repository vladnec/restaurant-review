import React, { Component } from "react";
import MapContainer from "./MapContainer";
import RestaurantsNearbyCard from "./components/restaurantsAPI";
import API_KEY from './API_KEY';

import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Modal from 'react-responsive-modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open : false,
      restaurantsNearby: [],
      lat: null,
      lng: null,
      newRestaurantLat:null,
      newRestaurantLng:null,
      newRestaurantName:null,
      newRestaurantRating:null,
      newRestaurantAddress:null,
      newRestaurantReviews:[]
    };
  }
  _isMounted = false;

  onOpenModal = () => {
    this.setState({ open: true });
  };
 
  onCloseModal = () => {
    this.setState({ open: false });
  };

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
  onRestaurantFormSubmit() {
    // this.setState({
    //   restaurantsNearby: [
    //     {
    //       name: "Gica",
    //       formattedAddress: formattedAddress,
    //       geometry: {
    //         location: {
    //           lat: x,
    //           lng: y
    //         }
    //       },
    //       restaurantId: 2,
    //       rating: 3,
    //       reviews: [
    //         {
    //           author_name: "vlad",
    //           rating: 5,
    //           text: "very clean, nice"
    //         }
    //       ]
    //     },
    //     ...this.state.restaurantsNearby
    //   ]
    // });
  }

  onMapClickChange(lat, lng, formattedAddress) {
    this.onOpenModal()
    // this.setState({
    //   newRestaurantAddress: formattedAddress,
    //   newRestaurantLat: lat,
    //   newRestaurantLng: lng
    // });
        this.setState({
      restaurantsNearby: [
        {
          name: "Gica",
          formatted_address: formattedAddress,
          geometry: {
            location: {
              lat: lat,
              lng: lng
            }
          },
          restaurantId: 2,
          rating: 3,
          reviews: [
            {
              author_name: "vlad",
              rating: 5,
              text: "very clean, nice"
            }
          ]
        },
        ...this.state.restaurantsNearby
      ]
    });
  }

  getBrowserLocation() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  getStreetView(lat, lng) {
    let url = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&heading=0&pitch=-0.76&key=${API_KEY}`;
    return axios.get(url).then(response => {
      return response.config.url;
    });
  }

  getNearbyPlaces() {
    const radius = 80;
    const { lat, lng } = this.state;

    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${API_KEY}`,
        {
          headers: { "Access-Control-Allow-Origin": "http://localhost:3000/" }
        }
      )
      .then(response => {
        response.data.results.map(item => {
          axios
            .get(
              `${"https://cors-anywhere.herokuapp.com/"}https://maps.googleapis.com/maps/api/place/details/json?placeid=${
                item.place_id
              }&key=${API_KEY}`,
              {
                headers: {
                  "Access-Control-Allow-Origin": "http://localhost:3000/"
                }
              }
            )
            .then(response => {
              this.setState(prevState => ({
                restaurantsNearby: [
                  ...prevState.restaurantsNearby,
                  response.data.result
                ]
              }));
            });
        });
      });
  }

  render() {
    const {open} = this.state;
    return (
      <div>
        <Modal 
          open={open}
          closeIconSize={14}
          onClose={this.onCloseModal}
          center
          >
        </Modal>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item md={6}>
            <MapContainer
              restaurantsNearby={this.state.restaurantsNearby}
              onMapClickChange={(x, y, info) =>
                this.onMapClickChange(x, y, info)
              }
              getStreetView={this.getStreetView}
              lat={this.state.lat}
              lng={this.state.lng}
              zoom={16}
            />
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
