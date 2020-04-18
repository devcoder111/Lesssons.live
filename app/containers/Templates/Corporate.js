import React from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { HeaderLanding, Footer } from 'enl-components';
import styles from './appStyles-jss';

class Corporate extends React.Component {
  componentDidMount = () => {
    // Scroll content to top
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // const mainContent = document.getElementById('app');
    window.removeEventListener('scroll', this.handleScroll);
  }


  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.appFrameLanding} id="mainContent">
        <HeaderLanding turnDarker />
        {children}
        <Footer />
      </div>
    );
  }
}

Corporate.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default (withStyles(styles)(Corporate));
