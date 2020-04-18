import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  LessonsLiveDashboard, NotFound
} from '../pageListAsync';

class DashboardRoute extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route path="/dashboard" component={withAuthorizationRouter(LessonsLiveDashboard)} />
          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

DashboardRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default DashboardRoute;
