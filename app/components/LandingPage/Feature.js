import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { injectIntl, intlShape } from 'react-intl';
import messages from './messages';
import Title from './Title';
import styles from './landingStyle-jss';

let counter = 0;
function createFeatureData(icon, title, desc) {
  counter += 1;
  return {
    id: counter,
    icon,
    title,
    desc
  };
}

class Feature extends React.Component {
  state = {
    featureList: [
      createFeatureData('video_call', 'Interactive Tools', 'Screen sharing, dual-video Lessons, file sharing, messaging, - tools to make every interaction "better than live".'),
      createFeatureData('fiber_smart_record', 'Recorded for Review', 'Review your lesson as many times as you\'d like - focus on a valuable tip, shared file or important moment in a class.'),
      createFeatureData('schedule', 'Ease of Scheduling', 'Our robust scheduling and communications tools make setting up your class and working with your instructor easy.')
    ]
  }

  render() {
    const { classes, intl } = this.props;
    const { featureList } = this.state;
    return (
      <div className={classes.feature}>
        <div className={classes.container}>
          <Title title={intl.formatMessage(messages.titleFeature)} desc="Our live interactive platform elevates music education to a whole new level. No need to struggle to learn from a YouTube video or watch a static class. Get real time feedback, share music, chat with your instructor, ask questions, make rapid progress and get instant confirmation." align="center" />
          <Grid container className={classes.root} spacing={5}>
            { featureList.map(item => (
              <Grid key={item.id.toString()} item xs={12} md={4}>
                <Typography component="h4" variant="h6">
                  <span className={classes.icon}>
                    <Icon>{item.icon}</Icon>
                  </span>
                  <br />
                  {item.title}
                </Typography>
                <Typography>
                  {item.desc}
                </Typography>
              </Grid>
            )) }
          </Grid>
        </div>
      </div>
    );
  }
}

Feature.propTypes = {
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export default withStyles(styles)(injectIntl(Feature));
