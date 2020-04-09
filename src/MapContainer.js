import React, { Component } from "react";
import API_KEY from "./API_KEY";
import axios from "axios";
import { Map, Marker, InfoWindow,  GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
      this.state = {
        showingInfoWindow: false, //Hides or the shows the infoWindow
        activeMarker: {}, //Shows the active marker upon click
        selectedPlace: {} //Shows the infoWindow to the selected place upon a marker
      };
      this.onMarkerClick=this.onMarkerClick.bind(this)
  }


  onMarkerClick (props, marker, e) {
    this.props.getStreetView(props.position.lat, props.position.lng)
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  mapClicked = (mapProps, map, event) => {
     const lat = event.latLng.lat();
     const lng = event.latLng.lng();
     let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
     axios.get(url).then(response => {
       if(response.data.status === "OK"){
        this.props.onMapClickChange(lat, lng, response.data.results[0].formatted_address);
      }
      else {
        console.log('error')
      }
   });
  }  
  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

   displayMarkers = () => {
    return this.props.restaurantsNearby.map((restaurant, index) => {
      return (
        <Marker
          key={index}
          id={index}
          position={{
            lat: restaurant.geometry.location.lat,
            lng: restaurant.geometry.location.lng
          }}
          onClick={this.onMarkerClick}
          name={restaurant.name}
          photoReference={restaurant.photos ? restaurant.photos[0].photo_reference : null}
        />
      );
    })
  }
  
  displayCurrentLocation = () => {
      return (
        <Marker
          position={{
            lat: this.props.lat,
            lng: this.props.lng
          }}
          name={"You are here !"}
          onClick={this.onMarkerClick}
          icon={{
            url:  "images/location_pin.png"
          }}
        />
      );
  }

  displayInfoWindow = () => {
    return (
      <InfoWindow
        marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
        onClose={this.onClose}
      >
        <div>
          <h4>{this.state.selectedPlace.name}</h4>
          <img alt="Google Street View"src={this.props.restaurantStreetView} height="150px" width="300px" /> 
          <img alt="Google Places Contribution" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${this.state.selectedPlace.photoReference}&key=${API_KEY}`} height="150px" width="300px" /> 
        </div>
      </InfoWindow>
    );
  }


  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    const mapStyle = {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden"
    };

    return (
      <Map
        google={this.props.google}
        zoom={this.props.zoom}
        style={mapStyle}
        initialCenter={{
          lat: this.props.lat,
          lng: this.props.lng
        }}
        center={{
          lat: this.props.lat,
          lng: this.props.lng
        }}
        onClick={this.mapClicked}
      >
        {this.displayCurrentLocation()}
        {this.displayMarkers()}
        {this.displayInfoWindow()}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapContainer);
