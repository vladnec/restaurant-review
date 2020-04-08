import React, { Component } from "react";
import MapContainer from "./MapContainer";
import GoogleRestaurantCard from "./components/GoogleRestaurantCard";
import NewRestaurantForm from "./components/restaurantForm/RegisterForm";
import API_KEY from './API_KEY';

import './styles/App.css';
import axios from "axios";
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
      restaurantStreetView:null,
      newRestaurantReviews:[]
    };
    this.changeRestaurantRating=this.changeRestaurantRating.bind(this)
    this.onRestaurantFormSubmit=this.onRestaurantFormSubmit.bind(this)
    this.getStreetView=this.getStreetView.bind(this)
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
  onRestaurantFormSubmit(formData) {
    this.setState({
      restaurantsNearby: [
        {
          name: formData.restaurantName,
          formatted_address: this.state.newRestaurantAddress,
          geometry: {
            location: {
              lat: this.state.newRestaurantLat,
              lng: this.state.newRestaurantLng
            }
          },
          rating: parseInt(formData.rating),
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
    this.onCloseModal()
  }
  changeRestaurantRating(nextValue, id) {
    this.setState({
      restaurantsNearby:this.state.restaurantsNearby.map(item=>{
        if(item.id === id ){
          if(item.hasRated) {
            return {
              ...item,
              rating:nextValue,
              hasRated: true,
              user_ratings_total : item.user_ratings_total 
            }
          } else {
            return {
              ...item,
              rating:nextValue,
              hasRated: true,
              user_ratings_total : item.user_ratings_total ? item.user_ratings_total + 1 : 1
            }
          }
        }
        return item;
      }),
    });
  }

  
  displayGoogleRestaurants() {
    return this.state.restaurantsNearby.map((restaurant, index) => {
      return (
        <GoogleRestaurantCard
        key={index}
        changeRestaurantRating={this.changeRestaurantRating}
        restaurant={restaurant}
        />
      )
    })
  }
  onMapClickChange(lat, lng, formattedAddress) {
    this.onOpenModal()
    this.setState({
      newRestaurantAddress: formattedAddress,
      newRestaurantLat: lat,
      newRestaurantLng: lng
    });
  }
  getBrowserLocation() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  getStreetView(lat, lng) {
    const self = this;
    let url = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&heading=0&pitch=-0.76&key=${API_KEY}`;
    axios.get(url).then(response => {
      self.setState({
        restaurantStreetView : response.config.url
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
    const {open} = this.state;
    return (
      <div>
         <div className="map-container">
            <MapContainer
              restaurantsNearby={this.state.restaurantsNearby}
              onMapClickChange={(x, y, info) =>
                this.onMapClickChange(x, y, info)
              }
              getStreetView={this.getStreetView}
              restaurantStreetView = {this.state.restaurantStreetView}
              lat={this.state.lat}
              lng={this.state.lng}
              zoom={16}
            />
          </div>
          <div className="restaurants-container">
              {this.displayGoogleRestaurants()}
          </div>
        <Modal 
            open={open}
            closeIconSize={14}
            onClose={this.onCloseModal}
            center>
            <NewRestaurantForm
            onRestaurantFormSubmit={this.onRestaurantFormSubmit}
            />
          </Modal>
      </div>
    );
  }
}

export default App;
