import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LocationOn from '@material-ui/icons/LocationOn';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import styles from './widget-jss';

const MapWithAMarker = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    {...props}
    defaultZoom={8}
    defaultCenter={{ lat: -34.360, lng: 118.000 }}
  >
    <Marker
      position={{ lat: -34.300, lng: 118.044 }}
    />
  </GoogleMap>
));

class MapWidget extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.mapWrap}>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-pY1CLDl5E_3MXXn1HnOFSMe6PbwSZO4&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '200px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
        <div className={classes.address}>
          <Card className={classes.card}>
            <CardContent>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <LocationOn />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Your Location" secondary="Town Hall Building no.45 Block C - ABC Street" />
              </ListItem>
            </CardContent>
          </Card>
        </div>
      </Paper>
    );
  }
}

MapWidget.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapWidget);
