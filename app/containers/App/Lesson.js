import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  Lesson, NotFound
} from '../pageListAsync';

class LessonRoute extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route path="/lesson/:hash" component={withAuthorizationRouter(Lesson)} />
          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

LessonRoute.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LessonRoute;
