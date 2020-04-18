import React from 'react';
import { PropTypes } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import {
  CardList
} from 'enl-components';
import styles from './settings-jss';

const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction="up" ref={ref} {...props} />;
});

class CardSettings extends React.Component {
  doneClick() {
    const { handleClose } = this.props;
    handleClose();
  }

  render() {
    const {
      classes,
      open,
      handleClose,
      title,
      data
    } = this.props;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {title}
            </Typography>
            <Button color="inherit" onClick={() => this.doneClick()}>
              done
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.detailWrap}>
          <CardList user={data} />
        </div>
      </Dialog>
    );
  }
}
CardSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default withStyles(styles)(CardSettings);
