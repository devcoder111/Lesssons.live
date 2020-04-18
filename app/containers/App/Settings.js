import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  ProfileSettings, NotFound
} from '../pageListAsync';

class SettingsRoute extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route path="/settings" component={withAuthorizationRouter(ProfileSettings)} />
          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

SettingsRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SettingsRoute;
