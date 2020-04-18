/*
 * User Profile Messages
 *
 * This contains all the text for the User Profile page.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Profile';

export default defineMessages({
  add_to_connection: {
    id: `${scope}.cover.add_to_connection`,
    defaultMessage: 'Add to Connection',
  },
  schedule_lesson: {
    id: `${scope}.cover.schedule_lesson`,
    defaultMessage: 'SCHEDULE LESSON',
  },
  about: {
    id: `${scope}.tab.about`,
    defaultMessage: 'ABOUT',
  },
  connections: {
    id: `${scope}.tab.connections`,
    defaultMessage: 'Connections',
  },
  availability: {
    id: `${scope}.tab.availability`,
    defaultMessage: 'Availability',
  },
  albums: {
    id: `${scope}.tab.albums`,
    defaultMessage: 'Videos&Photos',
  },
  my_album: {
    id: `${scope}.about.my_album`,
    defaultMessage: 'My Albums',
  },
  my_connection: {
    id: `${scope}.about.my_connection`,
    defaultMessage: 'My Connection',
  },
  my_interests: {
    id: `${scope}.about.my_interests`,
    defaultMessage: 'My Interest',
  },
  see_all: {
    id: `${scope}.about.see_all`,
    defaultMessage: 'See All',
  },
  see_profile: {
    id: `${scope}.connection.see_profile`,
    defaultMessage: 'See Profile',
  },
  quotes: {
    id: 'boilerplate.containers.UI.Typo.quotes.title',
    defaultMessage: 'Quotes'
  }
});
