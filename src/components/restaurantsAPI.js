import React from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import IconButton from '@material-ui/core/IconButton';
import LocationOn from '@material-ui/icons/LocationOn';
import Favorite from '@material-ui/icons/Favorite';
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import FaceGroup from "@mui-treasury/components/group/face";
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    overflow: "initial",
    marginBottom: "15px",
    marginLeft: "15px"
  },
  title: {
    marginBottom: 0
  },
  rateValue: {
    fontWeight: "bold",
    marginTop: 2
  },
  content: {
    position: "relative",
    padding: 24,
    width: "500px",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#fff",
    borderRadius: 4
  },
  favorite: {
    position: "absolute",
    top: 12,
    right: 12
  },
  locationIcon: {
    marginRight: 4,
    fontSize: 18
  },
  mediaStyles: {
    width: "100%",
    maxWidth: "200px",
    display: "block",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  }
}));

const ReviewCard = props => {
  const styles = useStyles();
  const shadowStyles = useFadedShadowStyles();
  const gutterStyles = usePushingGutterStyles({ firstExcluded: true });
  return (
    props.restaurantsNearby.map((restaurant, index) => {
      return (
        <Card key={index} elevation={0} className={styles.root}>
          <CardContent className={cx(shadowStyles.root, styles.content)}>
            <IconButton className={styles.favorite}>
              <Favorite />
            </IconButton>
            <h3 className={styles.title}>{restaurant.name}</h3>
            <Box color={'grey.500'} display={'flex'} alignItems={'center'} mb={1}>
              <LocationOn className={styles.locationIcon} />
              <span>{restaurant.formatted_address}</span>
            </Box>
            <Box
              display={'flex'}
              alignItems={'center'}
              mb={1}
              className={gutterStyles.parent}
            >
              <Rating name={'rating'} value={restaurant.rating} size={'small'} />
              <Typography variant={'body2'} className={styles.rateValue}>
                {restaurant.rating}
              </Typography>
            </Box>
            {restaurant.reviews.length > 0  ? (
              <Typography color={'textSecondary'} variant={'body2'}>
                {restaurant.reviews[0].text}
              </Typography>
            ) : ( <span></span> ) }      
            <Box
              mt={2}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
                className={gutterStyles.parent}
              >
                <FaceGroup
                  faces={[
                    'https://i.pravatar.cc/300?img=1',
                    'https://i.pravatar.cc/300?img=2',
                    'https://i.pravatar.cc/300?img=3',
                    'https://i.pravatar.cc/300?img=4',
                  ]}
                  size={32}
                  offset={-12}
                />
                <Typography
                  component={'span'}
                  variant={'body2'}
                  color={'textSecondary'}
                >
                {restaurant.user_ratings_total}
                </Typography>
              </Box>
              <IconButton size={'small'}>
                <MoreHoriz />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )
    })
  );
};

export default ReviewCard;