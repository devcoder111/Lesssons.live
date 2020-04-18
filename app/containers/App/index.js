import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Auth from './Auth';
import Application from './Application';
import Musicians from './Musicians';
import Musician from './Musician';
import Profile from './Profile';
import LessonRoute from './Lesson';
import SettingsRoute from './Settings';
import DashboardRoute from './Dashboard';
import HelpRoute from './Help';
import LandingCorporate from './Landing';
import ThemeWrapper, { AppContext } from './ThemeWrapper';
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends React.Component {
  render() {
    return (
      <ThemeWrapper>
        <AppContext.Consumer>
          {() => (
            <Switch>
              <Route path="/" exact component={LandingCorporate} />
              <Route
                path="/app"
                render={(props) => <Application {...props} />}
              />
              <Route
                path="/musicians"
                render={(props) => <Musicians {...props} />}
              />
              <Route
                path="/musician"
                render={(props) => <Musician {...props} />}
              />
              <Route
                path="/profile"
                render={(props) => <Profile {...props} />}
              />
              <Route
                path="/lesson"
                render={(props) => <LessonRoute {...props} />}
              />
              <Route
                path="/settings"
                render={(props) => <SettingsRoute {...props} />}
              />
              <Route
                path="/dashboard"
                render={(props) => <DashboardRoute {...props} />}
              />
              <Route
                path="/help"
                render={(props) => <HelpRoute {...props} />}
              />
              <Route component={Auth} />
            </Switch>
          )}
        </AppContext.Consumer>
      </ThemeWrapper>
    );
  }
}

export default App;
