import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Link, Route } from 'react-router-dom';
import styles from './breadCrumb-jss';

const LiveLessonsBreadcrumbs = (props) => {
  const {
    classes,
    theme,
    separator,
    breadcrumbs
  } = props;

  return (
    <section className={classNames(theme === 'dark' ? classes.dark : classes.light, classes.breadcrumbs)}>
      <Route
        path="*"
        render={() => {
          let parts = breadcrumbs;
          const place = parts[parts.length - 1];
          parts = parts.slice(0, parts.length - 1);
          return (
            <p>
              <span>
                {
                  parts.map((part) => (
                    <Fragment key={part.path}>
                      <Link to={part.path}>{part.title}</Link>
                      { separator }
                    </Fragment>
                  ))
                }
                &nbsp;
                {place.title}
              </span>
            </p>
          );
        }}
      />
    </section>
  );
};

LiveLessonsBreadcrumbs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
  separator: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.array.isRequired
};

export default withStyles(styles)(LiveLessonsBreadcrumbs);
