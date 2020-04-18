import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  LessonsLiveMusicianProfile, LessonsLiveSchedule, NotFound
} from '../pageListAsync';

class Musician extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }

          <Route path="/musician/:username/schedule" component={withAuthorizationRouter(LessonsLiveSchedule)} />
          <Route path="/musician/:username" component={withAuthorizationRouter(LessonsLiveMusicianProfile)} />
          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

Musician.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Musician;
