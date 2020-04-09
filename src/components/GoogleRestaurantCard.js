import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import LocationOn from "@material-ui/icons/LocationOn";
import StarRatingComponent from 'react-star-rating-component';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from "prop-types";
import FaceGroup from "@mui-treasury/components/group/face";

const styles = (theme) => ({
  root: {
    marginBottom: "15px",
    marginLeft: "15px",
    position: "relative",
    padding: 24,
    backgroundColor: "#fff"
  },
  title: {
    marginBottom: 0,
  },
  rateValue: {
    fontWeight: "bold",
    marginTop: 2,
  },
  content: {
    width: "500px",
    padding: 24,
    overflow: "initial",
    borderRadius: "5px",
    position: "relative",
    boxShadow: '0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)',
  },
  favorite: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  locationIcon: {
    marginRight: 4,
    fontSize: 18,
  },
  mediaStyles: {
    width: "100%",
    maxWidth: "200px",
    display: "block",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
});


class RestaurantGoogleCard extends Component {

  onStarClick(nextValue, prevValue, name) {
    this.props.onRestaurantRatingChange(nextValue, name)
  }
  onCloseClick(){
    this.props.removeGoogleRestaurant(this.props.restaurant.id)
  }

  render() {

    const { classes } = this.props;
    return (
      <Card elevation={0} className={classes.root}>
        <CardContent className={classes.content} >
          <IconButton id={this.props.restaurant.id} onClick={this.onCloseClick.bind(this)} className={classes.favorite}>
            <CloseIcon/>
          </IconButton>
          <h3 className={classes.title}>{this.props.restaurant.name}</h3>
          <Box color={"grey.500"} display={"flex"} alignItems={"center"} mb={1} >
            <LocationOn className={classes.locationIcon} />
            <span>{this.props.restaurant.formatted_address}</span>
          </Box>
          <Box display={"flex"} alignItems={"center"} mb={1}>
            <StarRatingComponent name={this.props.restaurant.id} value={this.props.restaurant.rating} onStarClick={this.onStarClick.bind(this)} />
            <Typography variant={"body2"} className={classes.rateValue}>
              {this.props.restaurant.rating}
            </Typography>
          </Box>
          {this.props.restaurant.reviews && this.props.restaurant.reviews.length > 0 ? (
            <Typography color={"textSecondary"} variant={"body2"}>
              {this.props.restaurant.reviews[0].text}
            </Typography>
          ) : (
              <span></span>
            )}
          <Box
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <FaceGroup
                faces={[
                  "https://i.pravatar.cc/300?img=1",
                  "https://i.pravatar.cc/300?img=2",
                  "https://i.pravatar.cc/300?img=3",
                  "https://i.pravatar.cc/300?img=4",
                ]}
                size={32}
                offset={-12}
              />
              <Typography
                component={"span"}
                variant={"body2"}
                color={"textSecondary"}
              >
                {this.props.restaurant.user_ratings_total}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }
}

RestaurantGoogleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RestaurantGoogleCard);
