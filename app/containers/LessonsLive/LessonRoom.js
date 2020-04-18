import React from 'react';
import {
  PapperBlock,
  TwilioVideo
} from 'enl-components';

class LessonsLessonRoom extends React.Component {
  render() {
    return (
      <div>
        <PapperBlock title="Lesson Room" desc="Page for video call.">
          <div>
            Lesson Room
          </div>
          <TwilioVideo />
        </PapperBlock>
      </div>
    );
  }
}

export default LessonsLessonRoom;
