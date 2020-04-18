import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Video from 'twilio-video';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { isMobile } from 'react-device-detect';
import history from '../../utils/history';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  twilioBlock: {
    marginTop: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.secondary.light
  },
  remoteVideo: {
    '& > div > video': {
      height: 250
    }
  },
  localVideo: {
    '& > div > div > video': {
      height: 250
    }
  }
});
class TwilioVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: null,
      roomName: '',
      roomNameErr: false, // Track error for room name TextField
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: '' // Track the current active room
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
    this.trackPublished = this.trackPublished.bind(this);
  }

  componentDidMount() {
    this.unblock = history.block(targetLocation => {
      this.leaveRoom();
    });
  }

  componentWillUnmount() {
    this.unblock();
  }

  componentWillReceiveProps(newProps) {
    const { currentUser } = newProps;
    const twilioUsername = isMobile ? currentUser.username + '-mobile' : currentUser.username;
    axios
      .get(
        'https://denim-camel-6078.twil.io/video-token?identity='
          + twilioUsername
      )
      .then(results => {
        const { identity, token } = results.data;
        this.setState({ identity, token });
        this.joinRoom();
      });
  }

  // Get the Participant's Tracks.
  getTracks(participant) {
    return Array.from(participant.tracks.values())
      .filter(publication => publication.track)
      .map(publication => publication.track);
  }

  handleRoomNameChange(e) {
    const roomName = e.target.value;
    this.setState({ roomName });
  }

  joinRoom() {
    const { previewTracks, token } = this.state;
    const { roomName } = this.props;
    if (!roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

    console.log("Joining room '" + roomName + "'...");
    const connectOptions = {
      name: roomName
    };

    if (previewTracks) {
      connectOptions.tracks = previewTracks;
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    Video.connect(token, connectOptions).then(this.roomJoined, error => {
      alert('Could not connect to Twilio: ' + error.message);
    });
  }

  attachTracks(tracks, container) {
    const _this = this;
    tracks.forEach(track => {
      _this.attachTrack(track, container);
    });
  }

  // Attach the Track to the DOM.
  attachTrack(track, container) {
    container.appendChild(track.attach());
  }

  // Attaches a track to a specified DOM container
  attachParticipantTracks(participant, container) {
    console.log('container :', container, this.getTracks(participant));
    this.attachTracks(this.getTracks(participant), container);
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      this.detachTrack(track);
    });
  }

  detachTrack(track) {
    track.detach().forEach(detachedElement => {
      detachedElement.remove();
    });
  }

  detachParticipantTracks(participant) {
    this.detachTracks(this.getTracks(participant));
  }

  participantConnected(participant, container) {
    const _this = this;
    const selfContainer = document.createElement('div');
    selfContainer.id = `participantContainer-${participant.identity}`;

    container.appendChild(selfContainer);

    participant.tracks.forEach(publication => {
      _this.trackPublished(publication, selfContainer);
    });
    participant.on('trackPublished', publication => {
      _this.trackPublished(publication, selfContainer);
    });
    // participant.on("trackUnpublished", trackUnpublished);
  }

  // A new RemoteTrack was published to the Room.
  trackPublished(publication, container) {
    if (publication.isSubscribed) {
      this.attachTrack(publication.track, container);
    }
    const _this = this;
    publication.on('subscribed', track => {
      console.log('Subscribed to ' + publication.kind + ' track');
      _this.attachTrack(track, container);
    });
    publication.on('unsubscribed', this.detachTrack);
  }

  roomJoined(room) {
    const { identity, previewTracks } = this.state;
    // Called when a participant joins a room
    console.log("Joined as '" + identity + "'");
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true
    });

    console.log('localParticipant :', room.localParticipant);
    // Attach LocalParticipant's Tracks, if not already attached.

    const previewContainer = document.getElementById('local-media');
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }
    const _this = this;
    const remoteMediaContainer = document.getElementById('remote-media');
    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'");
      _this.participantConnected(participant, remoteMediaContainer);
    });

    // When a Participant joins the Room, log the event.

    room.on('participantConnected', participant => {
      console.log("Joining: '" + participant.identity + "'");
      _this.participantConnected(participant, remoteMediaContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', participant => {
      console.log("Joining: '" + participant.identity + "'");
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      console.log(participant.identity + ' added track: ' + track.kind);
      this.attachTracks([track], previewContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      console.log(participant.identity + ' removed track: ' + track.kind);
      this.detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', participant => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      if (previewTracks) {
        previewTracks.forEach(track => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.setState({
        activeRoom: null,
        hasJoinedRoom: false,
        localMediaAvailable: false
      });
    });
  }

  leaveRoom() {
    const { activeRoom } = this.state;
    activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  }

  render() {
    const { localMediaAvailable, hasJoinedRoom } = this.state;
    // Only show video track after user has joined a room
    const showLocalTrack = localMediaAvailable ? (
      <div className="flex-item">
        <div id="local-media" />
      </div>
    ) : (
      ''
    );

    const { classes } = this.props;

    return (
      <div>
        <Grid container spacing={0} alignItems="center" justify="center" className={classes.twilioBlock}>
          <Grid container className={classes.localVideo}>
            {showLocalTrack}
          </Grid>
          <Grid container alignItems="center" justify="center">
            <div className={classes.remoteVideo} id="remote-media" />
          </Grid>
        </Grid>
      </div>
    );
  }
}

TwilioVideo.propTypes = {
  classes: PropTypes.object.isRequired
};

const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  currentUser: state.get(reducerProfile).currentUser,
  ...state
});
const TwilioVideoMapped = connect(mapStateToProps)(TwilioVideo);

export default withStyles(styles)(TwilioVideoMapped);
