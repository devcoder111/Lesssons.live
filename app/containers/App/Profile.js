import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  LessonsLiveRegularProfile, NotFound
} from '../pageListAsync';

class Musician extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route path="/profile/:username" component={withAuthorizationRouter(LessonsLiveRegularProfile)} />
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
