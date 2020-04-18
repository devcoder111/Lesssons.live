import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  LessonsLiveMusicians, NotFound
} from '../pageListAsync';

class Musicians extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route exact path="/musicians" component={withAuthorizationRouter(LessonsLiveMusicians)} />

          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

Musicians.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Musicians;
