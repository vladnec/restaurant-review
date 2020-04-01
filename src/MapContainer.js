import React, { Component } from "react";
import API_KEY from "./API_KEY";
import { Map, Marker, InfoWindow,  GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
      this.state = {
        showingInfoWindow: false, //Hides or the shows the infoWindow
        activeMarker: {}, //Shows the active marker upon click
        selectedPlace: {} //Shows the infoWindow to the selected place upon a marker
      };
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

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
          name={restaurant.name}
          onClick={this.onMarkerClick}
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
        </div>
      </InfoWindow>
    );
  }


  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }
    const mapStyle = {
      width: "50%",
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
