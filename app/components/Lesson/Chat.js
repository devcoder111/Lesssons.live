import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import {
  syncMessages,
  addMessage,
  sendMessage,
  resetMessages
} from 'enl-redux/actions/chatActions';

import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Send from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Type from 'enl-styles/Typography.scss';
import dummyContents from 'enl-api/dummy/dummyContents';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import moment from 'moment';
import styles from './chatStyle-jss';
import MessageField from './MessageField';

function scrollToBottom() {
  const ctn = document.getElementById('roomContainer');
  if (ctn !== null) {
    setTimeout(() => {
      ctn.scrollTo(0, ctn.scrollHeight);
    }, 300);
  }
}

class LessonChat extends React.Component {
  constructor() {
    super();
    this.state = { message: '' };
  }

  componentDidMount() {
    const {
      syncMessagesFn, currentUser, participant, resetMessagesFn
    } = this.props;
    resetMessagesFn();
    if (typeof currentUser.uid !== 'undefined' && typeof participant.uid !== 'undefined') {
      syncMessagesFn(currentUser.uid, participant.uid);
    }
  }

  componentDidUpdate(prevProps) {
    const { participant, currentUser, syncMessagesFn } = this.props;
    if (typeof prevProps.participant.uid === 'undefined' && typeof participant.uid !== 'undefined') {
      syncMessagesFn(currentUser.uid, participant.uid);
    }
  }

  sendMessageByEnter = (event, message) => {
    if (event.key === 'Enter' && event.target.value !== '') {
      this.addMessage(message.__html);
      this.resetInput();
    }
  }

  sendMessage = message => {
    this.addMessage(message.__html);
    this.resetInput();
  }

  resetInput = () => {
    this.setState({ message: '' });
    this._field.setState({ value: '' });
    scrollToBottom();
  }

  handleWrite = (e, value) => {
    this.setState({ message: value });
  }

  addMessage(text) {
    const { sendMessageFn, currentUser, participant } = this.props;
    const messageData = {
      text,
      from: currentUser.uid,
      to: participant.uid,
      avatar: currentUser.avatarUrl,
      time: new Date()
    };
    sendMessageFn(currentUser.uid, participant.uid, messageData);
  }

  render() {
    const {
      messages,
      classes,
      participant,
      currentUser
    } = this.props;
    const { message } = this.state;
    const html = { __html: message };

    const getChat = dataArray => dataArray.map(data => {
      const renderHTML = { __html: data.text };
      scrollToBottom();
      return (
        <li className={data.from === currentUser.uid ? classes.from : classes.to} key={data.id}>
          <time dateTime={moment.utc(data.time.seconds * 1000).format('LLL')}>{moment.utc(data.time.seconds * 1000).format('LLL')}</time>
          <Avatar alt="avatar" src={data.avatar || dummyContents.user.avatar} className={classes.avatar} />
          <div className={classes.talk}>
            <p><span dangerouslySetInnerHTML={renderHTML} /></p>
          </div>
        </li>
      );
    });
    return (
      <div>
        <div className={classNames(classes.root, classes.content)}>
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, classes.fixHeight, classes.appBarShift)}
          >
            <div className={classes.cover}>
              <Avatar alt="avatar" src={dummyContents.user.avatar} className={classes.avatar} />
              <Typography variant="h6" component="h2" color="inherit" noWrap>
                {participant.displayName}
                <Typography variant="caption" className={classes.status} color="inherit" noWrap>
                  <span className={classNames(classes.statusLine, classes.online)} />
                  &nbsp;
                  Online
                </Typography>
              </Typography>
            </div>
          </AppBar>

          <ul className={classes.chatList} id="roomContainer">
            {messages.length > 0 ? getChat(messages) : (<Typography display="block" variant="caption" className={Type.textCenter}>{'You haven\'t made any conversation yet'}</Typography>)}
          </ul>
          <Paper className={classes.writeMessage}>
            <MessageField
              onChange={this.handleWrite}
              ref={(_field) => { this._field = _field; return this._field; }}
              placeholder="Type a message"
              fieldType="input"
              value={message}
              onKeyPress={(event) => this.sendMessageByEnter(event, html)}
            />
            <Tooltip id="tooltip-send" title="Send">
              <div>
                <IconButton mini="true" color="secondary" disabled={message === ''} onClick={() => this.sendMessage(html)} aria-label="send" className={classes.sendBtn}>
                  <Send />
                </IconButton>
              </div>
            </Tooltip>
          </Paper>
        </div>
      </div>

    );
  }
}


LessonChat.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  participant: PropTypes.object.isRequired,
  syncMessagesFn: PropTypes.func.isRequired,
  sendMessageFn: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  resetMessagesFn: PropTypes.func.isRequired
};
const mapDispatchToProps = {
  syncMessagesFn: syncMessages,
  addMessageFn: addMessage,
  sendMessageFn: sendMessage,
  resetMessagesFn: resetMessages
};

const reducerChat = 'chatReducer';
const reducerProfile = 'profileReducer';
const mapStateToProps = state => ({
  messages: state.get(reducerChat).messages,
  currentUser: state.get(reducerProfile).currentUser,
  ...state,
});

const LessonChatMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(LessonChat);


export default withStyles(styles)(injectIntl(LessonChatMapped));
