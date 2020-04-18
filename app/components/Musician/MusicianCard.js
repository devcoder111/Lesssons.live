import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import Fab from '@material-ui/core/Fab';
import {
  InstrumentIcon
} from 'enl-components';
import history from '../../utils/history';
import imgApi from '../../api/images/photos';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  cardProduct: {
    position: 'relative'
  },
  mediaProduct: {
    height: 0,
    paddingTop: '60.25%', // 16:9
  },
  rightAction: {
    '&:not(:first-child)': {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center'
    }
  },
  title: {
    fontSize: 20,
    height: 30,
    fontWeight: theme.typography.fontWeightMedium
  },
  lessonDate: {
    fontWeight: theme.typography.fontWeightMedium
  },
  cardActions: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(3)}px`
  },
  buttonAdd: {
    position: 'absolute',
    right: 20,
    top: -20,
  },
  floatingButtonWrap: {
    position: 'relative',
    paddingTop: 50
  },
});
class MusicianCard extends React.Component {
  render() {
    const {
      classes,
      lesson,
      user
    } = this.props;

    const name = (user.role === 'musician') ? lesson.user.displayName : lesson.musician.displayName;
    const avatarUrl = (user.role === 'musician') ? lesson.user.avatarUrl : lesson.musician.avatarUrl;
    return (
      <Card className={classes.cardProduct}>
        <CardMedia
          className={classes.mediaProduct}
          image={avatarUrl || imgApi[41]}
          title={name}
        />
        <CardContent className={classes.floatingButtonWrap}>
          {lesson.musician.instrument && (
            <Fab size="small" color="secondary" aria-label="add" className={classes.buttonAdd}>
              <InstrumentIcon instrument={lesson.musician.instrument} />
            </Fab>
          )}
          <Typography noWrap gutterBottom variant="h5" className={classes.title} component="h2">
            {name}
          </Typography>
          <Typography component="p" className={classes.lessonDate}>
            {moment(lesson.start).format('LL')}
          </Typography>
          <Typography component="p" className={classes.desc}>
            {moment(lesson.start).format('hh:mm') + '-' + moment(lesson.end).format('hh:mm a')}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Typography variant="h6">
            <span>
                $
              {10}
/hour
            </span>
          </Typography>
          <div className={classes.rightAction}>
            <Button size="small" variant="outlined" color="secondary" onClick={() => history.push('/lesson/' + lesson.id)}>
                See details
            </Button>

          </div>
        </CardActions>
      </Card>
    );
  }
}

MusicianCard.propTypes = {
  classes: PropTypes.object.isRequired,
  lesson: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

MusicianCard.defaultProps = {
  discount: '',
  soldout: false,
  prevPrice: 0,
  list: false,
  detailOpen: () => (false),
  addToCart: () => (false),
};

const MusicianCardResponsive = withWidth()(MusicianCard);
export default withStyles(styles)(injectIntl(MusicianCardResponsive));
