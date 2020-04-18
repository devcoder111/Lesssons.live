import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CloudUpload from '@material-ui/icons/CloudUpload';
import 'enl-styles/vendors/react-dropzone/react-dropzone.css';
import {
  profileUpdate
} from 'enl-redux/actions/profileActions';
import { firebaseFirestoreDb, firebaseStorage } from '../../firebase';

const styles = theme => ({
  dropItem: {
    borderColor: theme.palette.divider,
    background: theme.palette.background.default,
    borderRadius: theme.rounded.medium,
    color: theme.palette.text.disabled,
    textAlign: 'center'
  },
  uploadIconSize: {
    display: 'inline-block',
    '& svg': {
      width: 72,
      height: 72,
      fill: theme.palette.secondary.main,
    }
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    '& svg': {
      fill: theme.palette.common.white
    }
  },
  button: {
    marginTop: 20
  }
});

function delay(t, v) {
  return new Promise(((resolve) => {
    setTimeout(resolve.bind(null, v), t);
  }));
}

function keepTrying(triesRemaining, storageRef) {
  if (triesRemaining < 0) {
    return Promise.reject(new Error('out of tries'));
  }

  return storageRef.getDownloadURL()
    .then((url) => url)
    .catch((error) => {
      switch (error.code) {
        case 'storage/object-not-found':
          return delay(1000).then(() => {
            console.log('Downloading Resized Image...', triesRemaining);
            return keepTrying(triesRemaining - 1, storageRef);
          });
        default:
          return Promise.reject(error);
      }
    });
}

class ProfileSettingsDropZone extends React.Component {
  constructor(props) {
    super(props);

    const { currentUser, settingName } = this.props;
    const { acceptedFiles } = this.props;
    this.state = {
      openSnackBar: false,
      errorMessage: '',
      files: [], // eslint-disable-line
      acceptedFiles, // eslint-disable-line,
      uploadedFile: currentUser[settingName]
    };
    this.onDrop = this.onDrop.bind(this);
    this.storageUpload = this.storageUpload.bind(this);
  }

  onDrop(filesVal) {
    const { files } = this.state;
    const { filesLimit } = this.props;
    let oldFiles = files;
    const filesLimitVal = filesLimit || '3';
    oldFiles = oldFiles.concat(filesVal);
    if (oldFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        errorMessage: 'Cannot upload more than ' + filesLimitVal + ' items.',
      });
    } else {
      this.setState({ files: oldFiles });
      const image = oldFiles[0];
      const { userUid, settingName } = this.props;
      this.storageUpload(image, userUid, settingName);
    }
  }

  onDropRejected() {
    this.setState({
      openSnackBar: true,
      errorMessage: 'File too big, max size is 3MB',
    });
  }

  handleRequestCloseSnackBar = () => {
    this.setState({
      openSnackBar: false,
    });
  };

  storageUpload(image, userUid) {
    const { settingName, currentUser } = this.props;
    const _this = this;
    const filePath = `images/user_${userUid}/${settingName.slice(0, -3)}`;
    if (currentUser[settingName]) {
      const oldExtEndIndex = currentUser[settingName].indexOf('?alt=media');
      if (oldExtEndIndex !== -1) {
        const oldExtStartIndex = currentUser[settingName].indexOf(userUid);
        const oldExt = currentUser[settingName].substring(oldExtStartIndex, oldExtEndIndex).split('.').pop();
        firebaseStorage.ref(`${filePath}/${settingName.slice(0, -3)}.${oldExt}`).delete();
        firebaseStorage.ref(`${filePath}/thumbs/${settingName.slice(0, -3)}_200x200.${oldExt}`).delete();
      }
    }
    const fileExt = image.name.split('.').pop();
    const uploadTask = firebaseStorage.ref(`${filePath}/${settingName.slice(0, -3)}.${fileExt}`).put(image);
    uploadTask.on('state_changed', (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, (error) => {
      // Handle unsuccessful uploads
      console.log('Error upload file in Firebase :', error);
    }, () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      const downloadTask = firebaseStorage.ref(`${filePath}/thumbs/${settingName.slice(0, -3)}_200x200.${fileExt}`);
      // keepTrying(10, downloadTask).then((url) => console.log("7675634534534535", url))
      keepTrying(10, downloadTask).then((downloadURL) => {
      // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        _this.setState({ uploadedFile: downloadURL });
        firebaseFirestoreDb.collection('users').doc(userUid).update({ [settingName]: downloadURL });
        _this.props.profileUpdateFn({ [settingName]: downloadURL });
      });
    });
  }

  handleRemove(file, fileIndex) {
    const thisFiles = this.state.files; // eslint-disable-line
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    thisFiles.splice(fileIndex, 1);
    this.setState({ files: thisFiles });
  }

  render() {
    const {
      classes,
      showPreviews,
      maxSize,
      text,
      showButton,
      filesLimit,
      userUid,
      profileUpdateFn,
      currentUser,

      ...rest
    } = this.props;

    const {
      acceptedFiles,
      openSnackBar,
      errorMessage,
      uploadedFile
    } = this.state;
    const fileSizeLimit = maxSize || 3000000;

    const previewsByUrl = (imageUrl) => {
      if (imageUrl) {
        return (
          <div>
            <div className="imageContainer col fileIconImg">
              <figure className="imgWrap"><img className="smallPreviewImg" src={imageUrl} alt="preview" /></figure>
            </div>
          </div>
        );
      }
      return <div />;
    };
    let dropzoneRef;
    return (
      <div>
        <Dropzone
          accept={acceptedFiles.join(',')}
          onDrop={this.onDrop}
          onDropRejected={this.onDropRejected}
          acceptClassName="stripes"
          rejectClassName="rejectStripes"
          maxSize={fileSizeLimit}
          ref={(node) => { dropzoneRef = node; }}
          {...rest}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className={classNames(classes.dropItem, 'dropZone')}>
              <div className="dropzoneTextStyle">
                <input {...getInputProps()} />
                <p className="dropzoneParagraph">{text}</p>
                <div className={classes.uploadIconSize}>
                  <CloudUpload />
                </div>
              </div>
            </div>
          )}
          {/* end */}
        </Dropzone>
        {showButton && (
          <Button
            className={classes.button}
            fullWidth
            variant="contained"
            onClick={() => {
              dropzoneRef.open();
            }}
            color="secondary"
          >
            Click to upload file(s)
            <span className={classes.rightIcon}>
              <CloudUpload />
            </span>
          </Button>
        )}
        <div className="row preview">
          {showPreviews && previewsByUrl(uploadedFile)}
        </div>
        <Snackbar
          open={openSnackBar}
          message={errorMessage}
          autoHideDuration={4000}
          onClose={this.handleRequestCloseSnackBar}
        />
      </div>
    );
  }
}

ProfileSettingsDropZone.propTypes = {
  text: PropTypes.string.isRequired,
  acceptedFiles: PropTypes.array,
  showPreviews: PropTypes.bool.isRequired,
  showButton: PropTypes.bool,
  maxSize: PropTypes.number.isRequired,
  filesLimit: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  userUid: PropTypes.string.isRequired,
  profileUpdateFn: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  settingName: PropTypes.string.isRequired
};

ProfileSettingsDropZone.defaultProps = {
  acceptedFiles: [],
  showButton: false,
};

const mapDispatchToProps = {
  profileUpdateFn: profileUpdate,
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});

const ProfileSettingsDropZoneMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSettingsDropZone);


export default withStyles(styles)(ProfileSettingsDropZoneMapped);
