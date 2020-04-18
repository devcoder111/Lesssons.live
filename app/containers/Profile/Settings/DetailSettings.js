import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import {
  profileUpdate
} from 'enl-redux/actions/profileActions';
import {
  MusicianDetailsForm,
  RegularUserDetailsForm
} from 'enl-components';
import { firebaseFirestoreDb } from '../../../firebase';
import history from '../../../utils/history';

import styles from './settings-jss';
const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction="up" ref={ref} {...props} />;
});

class DetailSettings extends React.Component {
  profileForm = React.createRef();

  constructor(props) {
    super(props);
    this.showResult = this.showResult.bind(this);
    this.doneClick = this.doneClick.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  showResult(values) {
    console.log('!!!!! showResult !!!!:', values);
    const updatedUserData = {};
    const { data } = this.props;
    const { profileUpdateFn } = this.props;

    // console.log('values :', values);
    values.forEach((value, key) => {
      if (key === 'avatarUrl' || key === 'profileBackgroundUrl') {
        return;
      }
      updatedUserData[key] = value;
    });
    console.log('showResult :', updatedUserData);
    firebaseFirestoreDb.collection('users').doc(updatedUserData.uid).update(updatedUserData);
    profileUpdateFn(updatedUserData);
    if (data.username !== updatedUserData.username) {
      history.push('/musician/' + updatedUserData.username);
    }
  }

  doneClick() {
    if (this.profileForm.current !== null) {
      const submitResult = this.profileForm.current.submit();
      console.log('submitResult :', submitResult);
    }
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

          {data.role === 'musician' && (
            <MusicianDetailsForm ref={this.profileForm} onSubmit={(values) => this.showResult(values)} data={data} />
          )}
          {data.role === 'regular' && (
            <RegularUserDetailsForm ref={this.profileForm} onSubmit={(values) => this.showResult(values)} data={data} />
          )}

        </div>
      </Dialog>
    );
  }
}

DetailSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  profileUpdateFn: PropTypes.func.isRequired,
};


const mapDispatchToProps = {
  profileUpdateFn: profileUpdate,
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});

const DetailSettingsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailSettings);

export default withStyles(styles)(DetailSettingsMapped);
