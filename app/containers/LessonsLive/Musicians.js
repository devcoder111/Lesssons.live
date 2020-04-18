import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PeopleIcon from '@material-ui/icons/People';
import Typography from '@material-ui/core/Typography';
import {
  MusiciansListCard,
  InstrumentIcon
} from 'enl-components';
import history from '../../utils/history';

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

const instrumentsList = [
  'all',
  'piano',
  'bass',
  'guitar',
  'drum',
  'drums',
  'vocals',
  'sax'
];
class LessonsLiveMusicians extends React.Component {
  state = {
    value: 0,
  };

  componentDidMount() {
    const { location } = this.props;
    const { search } = location;
    const params = new URLSearchParams(search);
    let instrument = params.get('instrument');
    if (instrument === null) {
      instrument = 'all';
    }
    const tab = (instrumentsList.indexOf(instrument) < 0) ? 0 : instrumentsList.indexOf(instrument);

    this.setState({ value: tab });
  }

  handleChange = (event, value) => {
    this.setState({ value });
    history.push('/musicians?instrument=' + instrumentsList[value]);
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="secondary"
          >
            <Tab label="ALL MUSICIANS" icon={<PeopleIcon />} />
            <Tab label="PIANO" icon={<InstrumentIcon instrument="piano" />} />
            <Tab label="BASS" icon={<InstrumentIcon instrument="bass" />} />
            <Tab label="GUITAR" icon={<InstrumentIcon instrument="guitar" />} />
            <Tab label="DRUMS" icon={<InstrumentIcon instrument="drum" />} />
            <Tab label="DRUMS" icon={<InstrumentIcon instrument="drums" />} />
            <Tab label="VOCALS" icon={<InstrumentIcon instrument="vocals" />} />
            <Tab label="SAX" icon={<InstrumentIcon instrument="sax" />} />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><MusiciansListCard instrument="all" /></TabContainer>}
        {value === 1 && <TabContainer><MusiciansListCard instrument="piano" /></TabContainer>}
        {value === 2 && <TabContainer><MusiciansListCard instrument="bass" /></TabContainer>}
        {value === 3 && <TabContainer><MusiciansListCard instrument="guitar" /></TabContainer>}
        {value === 4 && <TabContainer><MusiciansListCard instrument="drums" /></TabContainer>}
        {value === 5 && <TabContainer><MusiciansListCard instrument="saxophone" /></TabContainer>}
        {value === 6 && <TabContainer><MusiciansListCard instrument="vocals" /></TabContainer>}
        {value === 7 && <TabContainer><MusiciansListCard instrument="sax" /></TabContainer>}
      </div>
    );
  }
}

LessonsLiveMusicians.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(LessonsLiveMusicians);
