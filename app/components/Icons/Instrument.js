import React from 'react';
import PropTypes from 'prop-types';
import {
  DrumIcon,
  PianoIcon,
  BassIcon,
  GuitarIcon,
  DrumsIcon,
  MicrophoneIcon,
  SaxIcon
} from 'enl-components';

class InstrumentIcon extends React.Component {
  components = {
    drum: DrumIcon,
    bass: BassIcon,
    piano: PianoIcon,
    guitar: GuitarIcon,
    drums: DrumsIcon,
    vocals: MicrophoneIcon,
    sax: SaxIcon
  }

  render() {
    const { instrument } = this.props;
    const InstrumentIcon = this.components[instrument];
    return (
      <InstrumentIcon />
    );
  }
}

InstrumentIcon.propTypes = {
  instrument: PropTypes.string.isRequired
};

export default InstrumentIcon;
