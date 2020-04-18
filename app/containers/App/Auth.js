import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'containers/Pages/Standalone/NotFoundDedicated';
import Outer from '../Templates/Outer';
import {
  LoginFullstack, RegisterFullstack,
  ResetPasswordFullstack,
  LockScreen, ComingSoon,
  Maintenance, TermsConditions
} from '../pageListAsync';

class Auth extends React.Component {
  render() {
    return (
      <Outer>
        <Switch>
          <Route path="/login" component={LoginFullstack} />
          <Route path="/register" component={RegisterFullstack} />
          <Route path="/reset-password" component={ResetPasswordFullstack} />
          <Route path="/lock-screen" component={LockScreen} />
          <Route path="/maintenance" component={Maintenance} />
          <Route path="/coming-soon" component={ComingSoon} />
          <Route path="/terms-conditions" component={TermsConditions} />
          <Route component={NotFound} />
        </Switch>
      </Outer>
    );
  }
}

export default Auth;
