import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import {
  HelpSupport, NotFound
} from '../pageListAsync';

class HelpRoute extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route path="/help" component={HelpSupport} />
          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

HelpRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default HelpRoute;
