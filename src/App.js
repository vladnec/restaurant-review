import React, { Component } from "react";
import MapContainer from "./MapContainer";
import GoogleRestaurantCard from "./components/GoogleRestaurantCard";
import ReviewRestaurantForm from "./components/ReviewRestaurantForm";
import NewRestaurantForm from "./components/NewRestaurantForm";
import API_KEY from './API_KEY';

import './styles/App.css';
import axios from "axios";
import Modal from 'react-responsive-modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      restaurantsNearby: [],
      restaurantStreetView: null,
      lat: null,
      lng: null,
      newRestaurant: {
        lat:null,
        lng:null,
        address:null
      },
      newReview: {
        rating: 0,
        id: ''
      },
      modalAction: ''
    };
    this.onRestaurantRatingSubmit = this.onRestaurantRatingSubmit.bind(this)
    this.onRestaurantRatingChange = this.onRestaurantRatingChange.bind(this)
    this.onRestaurantFormSubmit = this.onRestaurantFormSubmit.bind(this)
    this.removeGoogleRestaurant = this.removeGoogleRestaurant.bind(this)
    this.getStreetView = this.getStreetView.bind(this)
  }
  _restaurantID = 1;

  onOpenModal = (modalAction) => {
    this.setState({ modalAction })
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };
  componentDidMount() {
    this.getLocalRestaurants()
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
  getLocalRestaurants(){
    axios.get('./restaurants.json')
    .then(response => {
      response.data.forEach(item => {
        this.setState(prevState => ({
          restaurantsNearby: [
            ...prevState.restaurantsNearby,
            item
          ]
        }))
      })
    })
  }
  getRestaurantID = () => {
    const id = this._restaurantID.toString();
    this._restaurantID += 1;
    return id;
  }
  getBrowserLocation() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  getStreetView(lat, lng) {
    const self = this;
    let url = `https://maps.googleapis.com/maps/api/streetview?size=300x150&location=${lat},${lng}&heading=0&pitch=-0.76&key=${API_KEY}`;
    axios.get(url).then(response => {
      self.setState({
        restaurantStreetView: response.config.url
      })
    });
  }
  getNearbyPlaces() {
    const radius = 10;
    const { lat, lng } = this.state;

    axios
      .get(
        `${"https://cors-anywhere.herokuapp.com/"}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${API_KEY}`,
        {
          headers: { "Access-Control-Allow-Origin": "http://localhost:3000/" }
        }
      )
      .then(response => {
        response.data.results.forEach(item => {
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
  renderGoogleRestaurants() {
    return this.state.restaurantsNearby.map((restaurant, index) => {
      return (
        <GoogleRestaurantCard
          key={index}
          onRestaurantRatingChange={this.onRestaurantRatingChange}
          removeGoogleRestaurant={this.removeGoogleRestaurant}
          restaurant={restaurant}
        />
      )
    })
  }
  renderGoogleMap(){
    return (
        <MapContainer
        restaurantsNearby={this.state.restaurantsNearby}
        onMapClickChange={(x, y, info) =>
          this.onMapClickChange(x, y, info)
        }
        getStreetView={this.getStreetView}
        restaurantStreetView={this.state.restaurantStreetView}
        lat={this.state.lat}
        lng={this.state.lng}
        zoom={16}
      />
    )
  }
  renderModal(){
    const { open } = this.state;
    return (
      <Modal 
      open={open}
      closeIconSize={14}
      onClose={this.onCloseModal}
      center>
      {this.state.modalAction === 'restaurant' ? (
        <NewRestaurantForm
          onRestaurantFormSubmit={this.onRestaurantFormSubmit}
        /> ) : (
        <ReviewRestaurantForm
          onRestaurantRatingSubmit={this.onRestaurantRatingSubmit}
        />
      )}
    </Modal>
    )
  }
  removeGoogleRestaurant(id) {
    this.setState({
      restaurantsNearby: this.state.restaurantsNearby.filter(restaurant => restaurant.id !== id)
    })
  }
  onMapClickChange(lat, lng, address) {
    this.onOpenModal('restaurant')
    this.setState({
      newRestaurant : {
        lat,
        lng,
        address
      }
    });
  }
  onRestaurantFormSubmit(formData) {
    this.setState({
      restaurantsNearby: [
        {
          name: formData.restaurantName,
          id: this.getRestaurantID(),
          formatted_address: this.state.newRestaurant.address,
          geometry: {
            location: {
              lat: this.state.newRestaurant.lat,
              lng: this.state.newRestaurant.lng
            }
          },
          rating: 0
        },
        ...this.state.restaurantsNearby
      ]
    });
    this.onCloseModal()
  }
  onRestaurantRatingChange(nextValue, id) {
    this.onOpenModal('review')
    this.setState({
      newReview: {
        rating: nextValue,
        id: id
      }
    })
  }
  onRestaurantRatingSubmit(formData) {
    const {id, rating } = this.state.newReview
    let ratingTotal
    this.setState({
      restaurantsNearby: this.state.restaurantsNearby.map(item => {
        if (item.id === id) {
          if (item.hasRated) {
            ratingTotal = item.user_ratings_total
          } else {
            ratingTotal = item.user_ratings_total ? item.user_ratings_total + 1 : 1
          }
          return {
            ...item,
            rating: rating,
            hasRated: true,
            user_ratings_total: ratingTotal,
            reviews: [
              {
                author_name: formData.authorName,
                rating: rating,
                text: formData.review
              }
            ]
          }
        }
        return item;
      }),
    });
    this.onCloseModal()
  }
  render() {
    return (
      <div>
        <div className="map-container">
          {this.renderGoogleMap()}
        </div>
        <div className="restaurants-container">
          {this.renderGoogleRestaurants()}
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default App;
