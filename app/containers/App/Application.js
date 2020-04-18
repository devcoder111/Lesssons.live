import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import withAuthorizationRouter from '../Session/withAuthorizationRouter';
import {
  MarketingDashboard, CryptoDashboard,
  Infographics, MiniApps, Analytics,
  Gallery, Status,
  Parent, AppLayout, Responsive, Grid,
  SimpleTable, AdvancedTable, TablePlayground,
  TreeTable, EditableCell, ReduxForm,
  DateTimePicker, CheckboxRadio,
  Switches, Selectbox,
  SliderRange, Buttons,
  ToggleButton, Textbox,
  Autocomplete, Upload, TextEditor,
  Avatars, Accordion, Badges,
  List, PopoverTooltip, Snackbar,
  Typography, Tabs, Cards,
  ImageGrid, Progress, DialogModal,
  Steppers, DrawerMenu,
  Breadcrumbs, Icons,
  SliderCarousel, Tags, TreeView,
  LineCharts, BarCharts, AreaCharts,
  PieCharts, RadarCharts, ScatterCharts, CompossedCharts,
  Todo, Contact, Email,
  TodoFirebase, ContactFirebase, EmailFirebase,
  Profile, Timeline, Chat,
  Ecommerce, ProductPage, CheckoutPage, Invoice,
  BlankPage, AuthenticatedPage,
  Photos, HelpSupport, Error, Settings,
  MapMarker, MapDirection, SearchMap,
  TrafficIndicator, StreetViewMap, LessonsLiveDashboard, LessonsLiveMusicians,
  LessonsLiveMusicianProfile, Calendar, LessonsLiveCheckout, LessonsLessonRoom,
  LessonsLiveSchedule, Lesson, ProfileSettings,
  NotFound
} from '../pageListAsync';

class Application extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Dashboard history={history}>
        <Switch>
          { /* Home */ }
          <Route exact path="/app" component={withAuthorizationRouter(LessonsLiveDashboard)} />
          <Route path="/app/musician/:username" component={withAuthorizationRouter(LessonsLiveMusicianProfile)} />
          <Route path="/app/musicians" component={withAuthorizationRouter(LessonsLiveMusicians)} />
          <Route path="/app/checkout" component={withAuthorizationRouter(LessonsLiveCheckout)} />
          <Route path="/app/room" component={withAuthorizationRouter(LessonsLessonRoom)} />
          <Route path="/app/musician/:username/schedule" component={withAuthorizationRouter(LessonsLiveSchedule)} />
          <Route path="/app/lesson/:hash" component={withAuthorizationRouter(Lesson)} />
          <Route path="/app/settings" component={withAuthorizationRouter(ProfileSettings)} />


          <Route path="/app/pages/calendar" component={Calendar} />
          <Route path="/app/marketing-dashboard" component={MarketingDashboard} />
          <Route path="/app/crypto-dashboard" component={CryptoDashboard} />
          { /* Widgets */ }
          <Route path="/app/widgets/infographics" component={Infographics} />
          <Route path="/app/widgets/mini-apps" component={MiniApps} />
          <Route path="/app/widgets/analytics" component={Analytics} />
          <Route path="/app/widgets/gallery-carousel" component={Gallery} />
          <Route path="/app/widgets/status" component={Status} />
          { /* Layout */ }
          <Route exact path="/app/layouts" component={Parent} />
          <Route path="/app/layouts/grid" component={Grid} />
          <Route path="/app/layouts/app-layout" component={AppLayout} />
          <Route path="/app/layouts/responsive" component={Responsive} />
          { /* Table */ }
          <Route exact path="/app/tables" component={Parent} />
          <Route path="/app/tables/basic-table" component={SimpleTable} />
          <Route path="/app/tables/data-table" component={AdvancedTable} />
          <Route path="/app/tables/table-playground" component={TablePlayground} />
          <Route path="/app/tables/editable-cell" component={EditableCell} />
          <Route path="/app/tables/tree-table" component={TreeTable} />
          { /* Form & Button */ }
          <Route exact path="/app/forms" component={Parent} />
          <Route path="/app/forms/reduxform" component={ReduxForm} />
          <Route path="/app/forms/date-time-picker" component={DateTimePicker} />
          <Route path="/app/forms/checkbox-radio" component={CheckboxRadio} />
          <Route path="/app/forms/switches" component={Switches} />
          <Route path="/app/forms/selectbox" component={Selectbox} />
          <Route path="/app/forms/slider-range" component={SliderRange} />
          <Route path="/app/forms/buttons" component={Buttons} />
          <Route path="/app/forms/toggle-button" component={ToggleButton} />
          <Route path="/app/forms/textfields" component={Textbox} />
          <Route path="/app/forms/autocomplete" component={Autocomplete} />
          <Route path="/app/forms/upload" component={Upload} />
          <Route path="/app/forms/wysiwyg-editor" component={TextEditor} />
          { /* Ui Components */}
          <Route exact path="/app/ui" component={Parent} />
          <Route path="/app/ui/avatars" component={Avatars} />
          <Route path="/app/ui/accordion" component={Accordion} />
          <Route path="/app/ui/badges" component={Badges} />
          <Route path="/app/ui/list" component={List} />
          <Route path="/app/ui/popover-tooltip" component={PopoverTooltip} />
          <Route path="/app/ui/snackbar" component={Snackbar} />
          <Route path="/app/ui/typography" component={Typography} />
          <Route path="/app/ui/tabs" component={Tabs} />
          <Route path="/app/ui/card-papper" component={Cards} />
          <Route path="/app/ui/image-grid" component={ImageGrid} />
          <Route path="/app/ui/progress" component={Progress} />
          <Route path="/app/ui/dialog-modal" component={DialogModal} />
          <Route path="/app/ui/steppers" component={Steppers} />
          <Route path="/app/ui/drawer-menu" component={DrawerMenu} />
          <Route path="/app/ui/breadcrumbs" component={Breadcrumbs} />
          <Route path="/app/ui/icons" component={Icons} />
          <Route path="/app/ui/slider-carousel" component={SliderCarousel} />
          <Route path="/app/ui/tags" component={Tags} />
          <Route path="/app/ui/tree-view" component={TreeView} />
          { /* Chart */ }
          <Route exact path="/app/charts" component={Parent} />
          <Route path="/app/charts/line-charts" component={LineCharts} />
          <Route path="/app/charts/bar-charts" component={BarCharts} />
          <Route path="/app/charts/area-charts" component={AreaCharts} />
          <Route path="/app/charts/pie-charts" component={PieCharts} />
          <Route path="/app/charts/radar-charts" component={RadarCharts} />
          <Route path="/app/charts/scatter-charts" component={ScatterCharts} />
          <Route path="/app/charts/compossed-chart" component={CompossedCharts} />
          { /* Sample Apps */ }
          <Route path="/app/pages/todo" component={Todo} />
          <Route path="/app/pages/contact" component={Contact} />
          <Route path="/app/pages/email" component={Email} />
          <Route path="/app/pages/contact-firebase" component={ContactFirebase} />
          <Route path="/app/pages/email-firebase" component={EmailFirebase} />
          <Route path="/app/pages/todo-firebase" component={TodoFirebase} />
          { /* Pages */ }
          <Route exact path="/app/pages" component={Parent} />
          <Route path="/app/pages/ecommerce" component={Ecommerce} />
          <Route path="/app/pages/product-detail" component={ProductPage} />
          <Route path="/app/pages/checkout" component={CheckoutPage} />
          <Route path="/app/pages/invoice" component={Invoice} />
          <Route path="/app/pages/user-profile" component={Profile} />
          <Route path="/app/settings-page" component={Settings} />
          <Route path="/app/pages/timeline" component={Timeline} />
          <Route path="/app/pages/chat" component={Chat} />
          <Route path="/app/pages/authenticated-page" component={withAuthorizationRouter(AuthenticatedPage)} />
          <Route path="/app/help" component={HelpSupport} />
          <Route path="/app/pages/blank-page" component={BlankPage} />
          <Route path="/app/pages/photo-gallery" component={Photos} />
          <Route path="/app/pages/not-found" component={NotFound} />
          <Route path="/app/pages/error" component={Error} />
          { /* Map */ }
          <Route exact path="/app/maps" component={Parent} />
          <Route path="/app/maps/map-marker" component={MapMarker} />
          <Route path="/app/maps/map-direction" component={MapDirection} />
          <Route path="/app/maps/map-searchbox" component={SearchMap} />
          <Route path="/app/maps/map-traffic" component={TrafficIndicator} />
          <Route path="/app/maps/street-view" component={StreetViewMap} />
          { /* Default */ }
          <Route component={NotFound} />
        </Switch>
      </Dashboard>
    );
  }
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Application;
