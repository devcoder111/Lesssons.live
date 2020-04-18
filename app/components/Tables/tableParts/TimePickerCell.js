import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import TableCell from '@material-ui/core/TableCell';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import css from 'enl-styles/Table.scss';

const styles = {
  dateButton: {
    '& button': {
      top: 16
    }
  }
};

class TimePickerCell extends React.Component {
  state = {
    event: {
      target: {
        name: this.props.cellData.type, // eslint-disable-line
        value: this.props.cellData.value, // eslint-disable-line
      }
    }
  }

  handleTimeChange = date => {
    const { event } = this.state;
    const { updateRow, branch } = this.props;
    event.target.value = date;
    updateRow(event, branch);
  }

  render() {
    const {
      edited,
      cellData,
      theme,
      classes
    } = this.props;
    const { event } = this.state;
    return (
      <TableCell padding="none" className={classNames('text-center', classes.dateButton)}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardTimePicker
            name={cellData.type}
            className={classNames(css.crudInput, theme.palette.type === 'dark' ? css.lightTxt : css.darkTxt)}
            mask="__:__ _M"
            placeholder="08:00 AM"
            value={event.target.value}
            disabled={!edited}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Icon>access_time</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={this.handleTimeChange}
          />
        </MuiPickersUtilsProvider>
      </TableCell>
    );
  }
}

TimePickerCell.propTypes = {
  cellData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  updateRow: PropTypes.func.isRequired,
  edited: PropTypes.bool.isRequired,
  branch: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimePickerCell);
