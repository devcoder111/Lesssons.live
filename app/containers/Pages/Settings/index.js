import React from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import settingList from 'enl-api/ui/settingList';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import dummy from 'enl-api/dummy/dummyContents';
import DetailSettings from './DetailSettings';
import styles from './settings-jss';

class Settings extends React.Component {
  state = {
    open: false,
    checked: ['switch', 'check2'],
    keyword: '',
    settingTitle: 'Settings'
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClickOpen = (title) => {
    this.setState({ open: true, settingTitle: title });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSearch = event => {
    this.setState({ keyword: event.target.value.toLowerCase() });
  }

  render() {
    const title = brand.name;
    const description = brand.desc;
    const { classes } = this.props;
    const { keyword, open, settingTitle } = this.state;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <Paper className={classes.paperStyled} elevation={0}>
          <Grid container spacing={2}>
            <Grid item sm={10} xs={12}>
              <div className={classes.profile}>
                <Avatar
                  alt={dummy.user.name}
                  src={dummy.user.avatar}
                  className={classes.avatar}
                />
                <div className={classes.profileText}>
                  <h4>{dummy.user.name}</h4>
                  {dummy.user.title}
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.root} elevation={4}>
          <section className={classes.settingList}>
            <Grid container spacing={2}>
              {settingList.map((menu, index) => {
                const rawKey = menu.name + menu.caption;
                if (rawKey.toLowerCase().indexOf(keyword) === -1) {
                  return false;
                }
                return (
                  <Grid item key={index.toString()} sm={4} xs={12}>
                    <Button onClick={() => this.handleClickOpen(menu.name)} color="secondary" className={classes.button}>
                      <Icon className={classes.icon}>{menu.icon}</Icon>
                      <span className={classes.text}>
                        {menu.name}
                        <Typography variant="caption" className={classes.info}>
                          {menu.caption}
                        </Typography>
                      </span>
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </section>
        </Paper>
        <DetailSettings open={open} handleClose={this.handleClose} title={settingTitle} />
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
