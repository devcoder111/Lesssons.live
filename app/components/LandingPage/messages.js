/*
 * Sidebar Component
 *
 * This contains all the text for the Sidebar Componen.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Landing';

export default defineMessages({
  feature: {
    id: `${scope}.header.feature`,
    defaultMessage: 'Features',
  },
  showcase: {
    id: `${scope}.header.showcase`,
    defaultMessage: 'Musicians',
  },
  technology: {
    id: `${scope}.header.technology`,
    defaultMessage: 'Technology',
  },
  contact: {
    id: `${scope}.header.contact`,
    defaultMessage: 'Contact',
  },
  login: {
    id: `${scope}.header.login`,
    defaultMessage: 'Sign In',
  },
  register: {
    id: `${scope}.header.register`,
    defaultMessage: 'Register',
  },
  subtitle: {
    id: `${scope}.banner.subtitle`,
    defaultMessage: 'Schedule live video lessons with world-class musicians',
  },
  demo: {
    id: `${scope}.banner.demo`,
    defaultMessage: 'Schedule Lesson',
  },
  buy: {
    id: `${scope}.banner.buy`,
    defaultMessage: 'View All Musicians',
  },
  titleFeature: {
    id: `${scope}.feature.title`,
    defaultMessage: 'Main Features',
  },
  titleShowcase: {
    id: `${scope}.showcase.title`,
    defaultMessage: 'Musicians',
  },
  tryShowcase: {
    id: `${scope}.showcase.try`,
    defaultMessage: 'View Openings',
  },
  demoShowcase: {
    id: `${scope}.showcase.demo`,
    defaultMessage: 'Schedule Lesson',
  },
  titleTech: {
    id: `${scope}.tech.title`,
    defaultMessage: 'Technologies',
  },
  buttonTech: {
    id: `${scope}.tech.button`,
    defaultMessage: 'Request To Implement Technology',
  },
  titleContact: {
    id: `${scope}.contact.title`,
    defaultMessage: 'Say hello to us',
  },
  nameContact: {
    id: `${scope}.contact.name`,
    defaultMessage: 'Name',
  },
  emailContact: {
    id: `${scope}.contact.email`,
    defaultMessage: 'Email',
  },
  messagesContact: {
    id: `${scope}.contact.messages`,
    defaultMessage: 'Message',
  },
  sendContact: {
    id: `${scope}.contact.send`,
    defaultMessage: 'Send',
  },
  copyright: {
    id: `${scope}.footer.copyright`,
    defaultMessage: '. All Right Reserved',
  }
});
