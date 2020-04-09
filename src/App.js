import React, { Component } from "react";
import MapContainer from "./MapContainer";
import GoogleRestaurantCard from "./components/GoogleRestaurantCard";
import ReviewRestaurantForm from "./components/ReviewRestaurantForm";
import NewRestaurantForm from "./components/restaurantForm/RegisterForm";
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
      lat: null,
      lng: null,
      newRestaurantLat: null,
      newRestaurantLng: null,
      newRestaurantName: null,
      newRestaurantRating: null,
      newRestaurantAddress: null,
      restaurantStreetView: null,
      newReview: {
        rating: 0,
        id: ''
      },
      modalAction: ''
    };
    this.onRestaurantRatingSubmit = this.onRestaurantRatingSubmit.bind(this)
    this.changeRestaurantRating = this.changeRestaurantRating.bind(this)
    this.onRestaurantFormSubmit = this.onRestaurantFormSubmit.bind(this)
    this.removeGoogleRestaurant = this.removeGoogleRestaurant.bind(this)
    this.getStreetView = this.getStreetView.bind(this)
  }
  _isMounted = false;
  _restaurantID = 1;

  onOpenModal = (modalAction) => {
    this.setState({ modalAction })
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  getRestaurantID = () => {
    const id = this._restaurantID.toString();
    this._restaurantID += 1;
    return id;
  }

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
  onRestaurantFormSubmit(formData) {
    this.setState({
      restaurantsNearby: [
        {
          name: formData.restaurantName,
          id: this.getRestaurantID(),
          formatted_address: this.state.newRestaurantAddress,
          geometry: {
            location: {
              lat: this.state.newRestaurantLat,
              lng: this.state.newRestaurantLng
            }
          },
          rating: 0
        },
        ...this.state.restaurantsNearby
      ]
    });
    this.onCloseModal()
  }

  removeGoogleRestaurant(id) {
    this.setState({
      restaurantsNearby: this.state.restaurantsNearby.filter(restaurant => restaurant.id !== id)
    })
  }
  changeRestaurantRating(nextValue, id) {
    this.onOpenModal('review')
    this.setState({
      newReview: {
        rating: nextValue,
        id: id
      }
    })
  }

  onRestaurantRatingSubmit(formData) {
    let id = this.state.newReview.id
    let rating = this.state.newReview.rating
    this.setState({
      restaurantsNearby: this.state.restaurantsNearby.map(item => {
        if (item.id === id) {
          if (item.hasRated) {
            return {
              ...item,
              rating: rating,
              hasRated: true,
              user_ratings_total: item.user_ratings_total,
              reviews: [
                {
                  author_name: formData.authorName,
                  rating: rating,
                  text: formData.review
                }
              ]
            }
          } else {
            return {
              ...item,
              rating: rating,
              hasRated: true,
              user_ratings_total: item.user_ratings_total ? item.user_ratings_total + 1 : 1,
              reviews: [
                {
                  author_name: formData.authorName,
                  rating: rating,
                  text: formData.review
                }
              ]
            }
          }
        }
        return item;
      }),
    });
    this.onCloseModal()
  }


  displayGoogleRestaurants() {
    return this.state.restaurantsNearby.map((restaurant, index) => {
      return (
        <GoogleRestaurantCard
          key={index}
          changeRestaurantRating={this.changeRestaurantRating}
          removeGoogleRestaurant={this.removeGoogleRestaurant}
          restaurant={restaurant}
        />
      )
    })
  }
  onMapClickChange(lat, lng, formattedAddress) {
    this.onOpenModal('restaurant')
    this.setState({
      newRestaurantAddress: formattedAddress,
      newRestaurantLat: lat,
      newRestaurantLng: lng
    });
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
    const radius = 350;
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

  render() {
    const { open } = this.state;
    return (
      <div>
        <div className="map-container">
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
        </div>
        <div className="restaurants-container">
          {this.displayGoogleRestaurants()}
        </div>
        {this.state.modalAction === 'restaurant' ? (
          <Modal
            open={open}
            closeIconSize={14}
            onClose={this.onCloseModal}
            center>
            <NewRestaurantForm
              onRestaurantFormSubmit={this.onRestaurantFormSubmit}
            />
          </Modal>
        ) :
          <Modal
            open={open}
            closeIconSize={14}
            onClose={this.onCloseModal}
            center>
            <ReviewRestaurantForm
              onRestaurantRatingSubmit={this.onRestaurantRatingSubmit}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default App;
