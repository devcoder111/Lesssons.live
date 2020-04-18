import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Banner,
  Feature,
  Showcase,
  Contact
} from 'enl-components';
import styles from 'enl-components/LandingPage/landingStyle-jss';

class HomePage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.landingWrap}>
        <section id="banner">
          <Banner />
        </section>
        <section id="showcase">
          <Showcase />
        </section>
        <section id="feature">
          <Feature />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </div>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (withStyles(styles)(HomePage));
