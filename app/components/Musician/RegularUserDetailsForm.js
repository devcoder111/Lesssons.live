import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  TextFieldRedux
} from 'enl-components/Forms/ReduxFormMUI';
import { initAction } from 'enl-redux/actions/reduxFormActions';
import { ProfileSettingsDropZone } from 'enl-components';
import Typography from '@material-ui/core/Typography';


const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    valueselected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonInit: {
    margin: theme.spacing(4),
    textAlign: 'center'
  },
});

class RegularUserDetailsForm extends Component {
  render() {
    const trueBool = true;
    const {
      classes,
      handleSubmit,
      init,
      data,
    } = this.props;

    init(data);
    return (
      <div>
        <Grid container spacing={3} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <div>
              <Typography variant="subtitle1" color="textSecondary">
                Profile image
              </Typography>
              <ProfileSettingsDropZone
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews
                maxSize={5000000}
                filesLimit={1}
                showButton
                text="Drag and drop image here or click"
                settingName="avatarUrl"
                userUid={data.uid}
              />
            </div>

            <div>
              <Typography variant="subtitle1" color="textSecondary">
                Profile background
              </Typography>
              <ProfileSettingsDropZone
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews
                maxSize={5000000}
                filesLimit={1}
                showButton
                text="Drag and drop image here or click"
                settingName="profileBackgroundUrl"
                userUid={data.uid}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <Field
                  name="username"
                  component={TextFieldRedux}
                  placeholder="Username"
                  label="Username"
                  validate={required}
                  required
                  ref={this.saveRef}
                  className={classes.field}
                />
              </div>
              <div>
                <Field
                  name="email"
                  component={TextFieldRedux}
                  placeholder="Email"
                  label="Email"
                  validate={[required, email]}
                  required
                  ref={this.saveRef}
                  className={classes.field}
                />
              </div>
              <div>
                <Field
                  name="displayName"
                  component={TextFieldRedux}
                  placeholder="Name"
                  label="Name"
                  validate={required}
                  required
                  ref={this.saveRef}
                  className={classes.field}
                />
              </div>
              <div className={classes.field}>
                <Field
                  name="bio"
                  className={classes.field}
                  component={TextFieldRedux}
                  placeholder="Profile Bio"
                  label="Profile Bio"
                  multiline={trueBool}
                  rows={4}
                />
              </div>

            </form>

          </Grid>
        </Grid>
      </div>
    );
  }
}

renderRadioGroup.propTypes = {
  input: PropTypes.object.isRequired,
};

RegularUserDetailsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  init: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch)
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(RegularUserDetailsForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
