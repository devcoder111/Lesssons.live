import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Ionicon from 'react-ionicons';
import IconButton from '@material-ui/core/IconButton';
import logo from 'enl-images/logo.png';
import brand from 'enl-api/dummy/brand';
import link from 'enl-api/ui/link';
import { injectIntl, FormattedMessage } from 'react-intl';
import petal from 'enl-images/decoration/petal5.svg';
import messages from './messages';
import styles from './landingStyle-jss';

let counter = 0;
function createData(name, url) {
  counter += 1;
  return {
    id: counter,
    name,
    url,
  };
}

function Decoration(props) {
  const { classes } = props;
  return (
    <div>
      <svg fill="#fff" className={classes.footerDecoration}>
        <use xlinkHref={petal + '#Petal-Bottom'} />
      </svg>
    </div>
  );
}

Decoration.propTypes = {
  classes: PropTypes.object.isRequired,
};

const DecorationStyled = withStyles(styles)(Decoration);

class Footer extends React.Component {
  state = {
    menuList: [
      createData('showcase', '#showcase'),
      createData('feature', '#feature'),
      createData('contact', '#contact'),
    ]
  }

  render() {
    const { menuList } = this.state;
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <DecorationStyled />
        <div className={classes.container}>
          <div className={classes.spaceContainer}>
            <div className={classes.brand}>
              <img src={logo} alt={brand.name} />
            </div>
            <nav>
              <ul>
                { menuList.map(item => (
                  <li key={item.id.toString()}>
                    <Button size="small" href={item.url}><FormattedMessage {...messages[item.name]} /></Button>
                  </li>
                )) }
              </ul>
            </nav>
          </div>
        </div>
        <div className={classes.copyright}>
          <div className={classes.container}>
            <p>
              &copy; 2020&nbsp;
              {brand.name}
              <FormattedMessage {...messages.copyright} />
              {' '}
            </p>
            <span>
              <IconButton color="primary" className={classes.button} href={link.facebook} target="_blank"><Ionicon icon="logo-facebook" /></IconButton>
              <IconButton color="primary" className={classes.button} href={link.twitter} target="_blank"><Ionicon icon="logo-twitter" /></IconButton>
              <IconButton color="primary" className={classes.button} href={link.instagram} target="_blank"><Ionicon icon="logo-instagram" /></IconButton>
            </span>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectIntl(Footer));
