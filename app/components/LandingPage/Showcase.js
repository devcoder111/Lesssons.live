import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import messages from './messages';
import ShowcaseCard from '../CardPaper/ShowcaseCard';
import Title from './Title';
import styles from './landingStyle-jss';
import { firebaseFirestoreDb } from '../../firebase';

function ParallaxDeco(props) {
  const { classes } = props;
  return (
    <div className={classes.parallaxWrap}>
      <ParallaxProvider>
        <div className={classes.bannerParallaxWrap}>
          <Parallax
            offsetYMax={70}
            offsetYMin={-200}
            slowerScrollRate
            tag="figure"
          >
            <svg
              fill="#fff"
              className={
                classNames(
                  classes.parallaxVertical,
                  classes.parallaxPetal1
                )
              }
            >
              <use xlinkHref="/images/decoration/petal3.svg#Petal-3" />
            </svg>
          </Parallax>
          <Parallax
            offsetYMax={100}
            offsetYMin={-200}
            slowerScrollRate
            tag="figure"
          >
            <svg
              fill="#fff"
              className={
                classNames(
                  classes.parallaxVertical,
                  classes.parallaxPetal2
                )
              }
            >
              <use xlinkHref="/images/decoration/petal4.svg#Petal-4" />
            </svg>
          </Parallax>
        </div>
      </ParallaxProvider>
    </div>
  );
}

ParallaxDeco.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ParallaxDecoStyled = withStyles(styles)(ParallaxDeco);

class Showcase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicians: []
    };
  }

  componentDidMount() {
    let user = [];
    const _this = this;
    firebaseFirestoreDb.collection('users').where('featured', '==', 'true').limit(6).get()
      .then((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          user = doc.data();
          user.uid = doc.id;
          users.push(user);
        });

        _this.setState({
          musicians: users
        });
      });
  }

  render() {
    const { classes, width, intl } = this.props;
    const { musicians } = this.state;
    return (
      <section className={classes.showcase}>
        <ParallaxDecoStyled />
        <div className={classes.container}>

          <Grid container className={classes.root} spacing={5}>

            <Grid item sm={6} md={4} xs={12}>
              <Title title={intl.formatMessage(messages.titleShowcase)} desc="Schedule lessons with the greatest musicians on the planet." align={width === 'lg' ? 'left' : 'center'} />

              {musicians.length > 0 && (
                <ShowcaseCard
                  title={musicians[0].displayName}
                  desc={musicians[0].headline}
                  action={intl.formatMessage(messages.demoShowcase)}
                  image={musicians[0].avatarUrl || '/images/screen/thumb5.jpg'}
                  href={'/musician/' + musicians[0].username}
                />

              )}
              {musicians.length > 1 && (
                <ShowcaseCard
                  title={musicians[1].displayName}
                  desc={musicians[1].headline}
                  action={intl.formatMessage(messages.demoShowcase)}
                  image={musicians[1].avatarUrl || '/images/screen/thumb5.jpg'}
                  href={'/musician/' + musicians[1].username}
                />
              )}

            </Grid>
            <Grid item sm={6} md={4} xs={12}>
              {musicians.length > 2 && (
                <ShowcaseCard
                  title={musicians[2].displayName}
                  desc={musicians[2].headline}
                  action={intl.formatMessage(messages.demoShowcase)}
                  image={musicians[2].avatarUrl || '/images/screen/thumb5.jpg'}
                  href={'/musician/' + musicians[2].username}
                />
              )}
              {musicians.length > 3 && (
                <ShowcaseCard
                  title={musicians[3].displayName}
                  desc={musicians[3].headline}
                  action={intl.formatMessage(messages.demoShowcase)}
                  image={musicians[3].avatarUrl || '/images/screen/thumb5.jpg'}
                  href={'/musician/' + musicians[3].username}
                />
              )}
            </Grid>
            <Grid item sm={6} md={4} xs={12}>
              {musicians.length > 4 && (
                <ShowcaseCard
                  title={musicians[4].displayName}
                  desc={musicians[4].headline}
                  action={intl.formatMessage(messages.demoShowcase)}
                  image={musicians[4].avatarUrl || '/images/screen/thumb5.jpg'}
                  href={'/musician/' + musicians[4].username}
                />
              )}
              {musicians.length > 5 && (
                <ShowcaseCard
                  title={musicians[5].displayName}
                  desc={musicians[5].headline}
                  action={intl.formatMessage(messages.demoShowcase)}
                  image={musicians[5].avatarUrl || '/images/screen/thumb5.jpg'}
                  href={'/musician/' + musicians[5].username}
                />
              )}
            </Grid>
          </Grid>
        </div>
      </section>
    );
  }
}


Showcase.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  intl: intlShape.isRequired
};

Showcase.defaultProps = {
  musicians: []
};

export default withWidth()(withStyles(styles)(injectIntl(Showcase)));
