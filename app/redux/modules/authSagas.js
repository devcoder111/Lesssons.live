import {
  call,
  fork,
  put,
  take,
  takeEvery,
  all
} from 'redux-saga/effects';
import randomUsername from 'random-username-generator';
import {
  firebaseAuth,
  firebaseSocialAuth,
  firebaseRsfFirestore,
  firebaseFirestoreDb
} from '../../firebase';
import history from '../../utils/history';
import {
  LOGIN_REQUEST,
  SOCIAL_SIGNUP_REQUEST,
  LOGIN_WITH_EMAIL_REQUEST,
  LOGOUT_REQUEST,
  REGISTER_WITH_EMAIL_REQUEST,
  REGISTER_SUCCESS,
  PASSWORD_FORGET_REQUEST,
} from '../constants/authConstants';
import {
  loginSuccess,
  loginFailure,
  logoutSuccess,
  logoutFailure,
  loginWithEmailSuccess,
  loginWithEmailFailure,
  syncUser,
  registerSuccess,
  registerWithEmailFailure,
  createUserSuccess,
  createUserFailure,
  passwordForgetSuccess,
  passwordForgetFailure,
} from '../actions/authActions';

import {
  profileUpdate,
  profileReset
} from '../actions/profileActions';


function getUrlVars() {
  const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { // eslint-disable-line
    vars[key] = value;
  });
  return vars;
}

function* loginSaga(provider) {
  try {
    yield call(firebaseAuth.signInWithPopup, provider.payload.authProvider);
    const firestoreUser = firebaseSocialAuth.currentUser;
    yield put(loginSuccess(firestoreUser));
    if (getUrlVars().next) {
      // Redirect to next route
      yield history.push(getUrlVars().next);
    } else {
      // Redirect to dashboard if no next parameter
      yield history.push('/app');
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
}

function* socialSignUpSaga(provider) {
  try {
    yield call(firebaseAuth.signInWithPopup, provider.payload.authProvider);
    const firestoreUser = firebaseSocialAuth.currentUser;
    yield put(registerSuccess(firestoreUser));
    firebaseFirestoreDb.collection('mail').add({
      to: firebaseSocialAuth.currentUser.email,
      message: {
        subject: 'Welcome to Lesson.Live!',
        text: 'This is the plaintext section of the email body.',
        html: '<table class=wrapper role=presentation style=border-collapse:collapse;table-layout:fixed;min-width:320px;width:100%;background-color:#f0f0f0 cellpadding=0 cellspacing=0><tr><td><div role=banner>\
		  <div style="Margin:0 auto;max-width:560px;min-width:280px;width:280px;width:calc(28000% - 167440px)"class=preheader><div style=border-collapse:collapse;display:table;width:100%><!--[if (mso)|(IE)]><table class=preheader role=presentation align=center cellpadding=0 cellspacing=0><tr><td style=width:280px valign=top><![endif]--><div style="display:table-cell;Float:left;font-size:12px;line-height:19px;max-width:280px;min-width:140px;width:140px;width:calc(14000% - 78120px);padding:10px 0 5px 0;color:#bdbdbd;font-family:Ubuntu,sans-serif"class=snippet></div><!--[if (mso)|(IE)]><td style=width:280px valign=top><![endif]-->\
		  <div style="display:table-cell;Float:left;font-size:12px;line-height:19px;max-width:280px;min-width:139px;width:139px;width:calc(14100% - 78680px);padding:10px 0 5px 0;text-align:right;color:#bdbdbd;font-family:Ubuntu,sans-serif"class=webversion></div><!--[if (mso)|(IE)]><![endif]--></div></div><div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px)"class=header id=emb-email-header-container><!--[if (mso)|(IE)]><table class=header role=presentation align=center cellpadding=0 cellspacing=0><tr><td style=width:600px><![endif]-->\
		  <div style=font-size:26px;line-height:32px;Margin-top:6px;Margin-bottom:20px;color:#c3ced9;font-family:Roboto,Tahoma,sans-serif;Margin-left:20px;Margin-right:20px class="emb-logo-margin-box logo"align=center>\
		  <div class=logo-center align=center id=emb-email-header><img alt=""src=https://i1.createsend1.com/ei/t/84/596/C7A/125510/csfinal/lessons-live-logo.png style=display:block;height:auto;width:100%;border:0;max-width:232px width=232></div></div><!--[if (mso)|(IE)]><![endif]--></div></div><div>\
		  <div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);overflow-wrap:break-word;word-wrap:break-word;word-break:break-word"class="layout one-col fixed-width stack"><div style=border-collapse:collapse;display:table;width:100%;background-color:#fff class=layout__inner><!--[if (mso)|(IE)]><table align=center cellpadding=0 cellspacing=0 role=presentation><tr class=layout-fixed-width style=background-color:#fff><td style=width:600px class=w560><![endif]--><div style=text-align:left;color:#787778;font-size:16px;line-height:24px;font-family:Ubuntu,sans-serif class=column>\
		  <div style=Margin-left:20px;Margin-right:20px;Margin-top:24px><div style=mso-line-height-rule:exactly;line-height:20px;font-size:1px> </div></div><div style=Margin-left:20px;Margin-right:20px><div style=mso-line-height-rule:exactly;mso-text-raise:11px;vertical-align:middle><h1 style=Margin-top:0;Margin-bottom:0;font-style:normal;font-weight:400;color:#565656;font-size:30px;line-height:38px;text-align:center><strong>Welcome to Lessons.Live!</strong></h1\>\
		  <p style=Margin-top:20px;Margin-bottom:20px> <br>Hello!  Welcome to Lessons.Live, the premiere online music lessons application offering quick and easy scheduling, video sharing, file sharing and live chat directly with world-class musicians. </div></div><div style=Margin-left:20px;Margin-right:20px><div style=mso-line-height-rule:exactly;line-height:10px;font-size:1px> </div></div><div style=Margin-left:20px;Margin-right:20px><div style=Margin-bottom:20px;text-align:center class="btn btn--flat btn--large"><!--[if !mso]-->\
		  <a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/ style="border-radius:4px;display:inline-block;font-size:14px;font-weight:700;line-height:24px;padding:12px 24px;text-align:center;text-decoration:none!important;transition:opacity .1s ease-in;color:#fff!important;background-color:#1565c0;font-family:Ubuntu,sans-serif"target=_blank>SCHEDULE FIRST LESSON!</a>\
		  <!--[endif]--><!--[if mso]><p style=line-height:0;margin:0> </p><v:roundrect xmlns:v=urn:schemas-microsoft-com:vml href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/ style=width:224px arcsize=9% fillcolor=#1565C0 stroke=f><v:textbox style=mso-fit-shape-to-text:t inset=0px,11px,0px,11px><center style=font-size:14px;line-height:24px;color:#fff;font-family:Ubuntu,sans-serif;font-weight:700;mso-line-height-rule:exactly;mso-text-raise:4px>SCHEDULE FIRST LESSON!</center></v:textbox></v:roundrect><![endif]--></div></div>\
		  <div style=Margin-left:20px;Margin-right:20px><div style=mso-line-height-rule:exactly;line-height:10px;font-size:1px> </div></div><div style=Margin-left:20px;Margin-right:20px;Margin-bottom:24px><div style=mso-line-height-rule:exactly;line-height:5px;font-size:1px> </div></div></div><!--[if (mso)|(IE)]><![endif]--></div></div><div style=mso-line-height-rule:exactly;line-height:10px;font-size:10px> </div><div role=contentinfo><div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);overflow-wrap:break-word;word-wrap:break-word;word-break:break-word"class="layout email-footer stack">\
		  <div style=border-collapse:collapse;display:table;width:100% class=layout__inner><!--[if (mso)|(IE)]><table align=center cellpadding=0 cellspacing=0 role=presentation><tr class=layout-email-footer><td style=width:400px valign=top class=w360><![endif]--><div style="text-align:left;font-size:12px;line-height:19px;color:#bdbdbd;font-family:Ubuntu,sans-serif;Float:left;max-width:400px;min-width:320px;width:320px;width:calc(8000% - 47600px)"class="column wide"><div style=Margin-left:20px;Margin-right:20px;Margin-top:10px;Margin-bottom:10px><table class=email-footer__links role=presentation style=border-collapse:collapse;table-layout:fixed emb-web-links="">\
		  <tr role=navigation><td emb-web-links=""style=padding:0;width:26px><a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-y/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=Facebook src=https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png style=border:0 width=26 height=26></a><td emb-web-links=""style="padding:0 0 0 3px;width:26px">\
		  <a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-j/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=Twitter src=https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png style=border:0 width=26 height=26></a><td emb-web-links=""style="padding:0 0 0 3px;width:26px"><a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-t/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=YouTube src=https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png style=border:0 width=26 height=26></a><td emb-web-links=""style="padding:0 0 0 3px;width:26px">\
		  <a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-i/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=Instagram src=https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png style=border:0 width=26 height=26></a></table><div style=font-size:12px;line-height:19px;Margin-top:20px><div>©2020 Lessons.Live - All Rights Reserved</div></div><div style=font-size:12px;line-height:19px;Margin-top:18px></div><!--[if mso]> <![endif]--></div></div><!--[if (mso)|(IE)]><td style=width:200px valign=top class=w160><![endif]-->\
		  <div style="text-align:left;font-size:12px;line-height:19px;color:#bdbdbd;font-family:Ubuntu,sans-serif;Float:left;max-width:320px;min-width:200px;width:320px;width:calc(72200px - 12000%)"class="column narrow"><div style=Margin-left:20px;Margin-right:20px;Margin-top:10px;Margin-bottom:10px></div></div\
		  ><!--[if (mso)|(IE)]><![endif]--></div></div><div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);overflow-wrap:break-word;word-wrap:break-word;word-break:break-word"class="layout email-footer one-col"><div style=border-collapse:collapse;display:table;width:100% class=layout__inner><!--[if (mso)|(IE)]>\
		  <table align=center cellpadding=0 cellspacing=0 role=presentation><tr class=layout-email-footer><td style=width:600px class=w560><![endif]--><div style=text-align:left;font-size:12px;line-height:19px;color:#bdbdbd;font-family:Ubuntu,sans-serif class=column><div style=Margin-left:20px;Margin-right:20px;Margin-top:10px;Margin-bottom:10px><div style=font-size:12px;line-height:19px><a href=https://lessonslive.createsend1.com/t/t-u-nujyuhy-l-d/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank>Unsubscribe</a></div></div></div><!--[if (mso)|(IE)]><![endif]--></div></div></div><div style=line-height:40px;font-size:40px> </div></div></table>',
      }
    }).then(() => console.log('Queued email for delivery!'));
    yield put(loginSuccess(firestoreUser));

    if (getUrlVars().next) {
      // Redirect to next route
      yield history.push(getUrlVars().next);
    } else {
      // Redirect to dashboard if no next parameter
      yield history.push('/app');
    }
  } catch (error) {
    console.log('error :', error);
    yield put(loginFailure(error));
  }
}

function* loginWithEmailSaga(payload) {
  try {
    const data = yield call(firebaseAuth.signInWithEmailAndPassword, payload.email, payload.password);
    yield put(loginWithEmailSuccess(data));
    if (getUrlVars().next) {
      // Redirect to next route
      yield history.push(getUrlVars().next);
    } else {
      // Redirect to dashboard if no next parameter
      yield history.push('/app');
    }
  } catch (error) {
    yield put(loginWithEmailFailure(error));
  }
}

function* registerWithEmailSaga(payload) {
  try {
    const fireabaseUser = yield call(firebaseAuth.createUserWithEmailAndPassword, payload.email, payload.password);
    yield call(firebaseAuth.updateProfile, {
      displayName: payload.name,
    });
    yield put(registerSuccess(fireabaseUser.user));
    console.log('registered User:', fireabaseUser.user.email);
    firebaseFirestoreDb.collection('mail').add({
      to: fireabaseUser.user.email,
      message: {
        subject: 'Welcome to Lesson.Live!',
        text: 'This is the plaintext section of the email body.',
        html: '<table class=wrapper role=presentation style=border-collapse:collapse;table-layout:fixed;min-width:320px;width:100%;background-color:#f0f0f0 cellpadding=0 cellspacing=0><tr><td><div role=banner>\
		  <div style="Margin:0 auto;max-width:560px;min-width:280px;width:280px;width:calc(28000% - 167440px)"class=preheader><div style=border-collapse:collapse;display:table;width:100%><!--[if (mso)|(IE)]><table class=preheader role=presentation align=center cellpadding=0 cellspacing=0><tr><td style=width:280px valign=top><![endif]--><div style="display:table-cell;Float:left;font-size:12px;line-height:19px;max-width:280px;min-width:140px;width:140px;width:calc(14000% - 78120px);padding:10px 0 5px 0;color:#bdbdbd;font-family:Ubuntu,sans-serif"class=snippet></div><!--[if (mso)|(IE)]><td style=width:280px valign=top><![endif]-->\
		  <div style="display:table-cell;Float:left;font-size:12px;line-height:19px;max-width:280px;min-width:139px;width:139px;width:calc(14100% - 78680px);padding:10px 0 5px 0;text-align:right;color:#bdbdbd;font-family:Ubuntu,sans-serif"class=webversion></div><!--[if (mso)|(IE)]><![endif]--></div></div><div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px)"class=header id=emb-email-header-container><!--[if (mso)|(IE)]><table class=header role=presentation align=center cellpadding=0 cellspacing=0><tr><td style=width:600px><![endif]-->\
		  <div style=font-size:26px;line-height:32px;Margin-top:6px;Margin-bottom:20px;color:#c3ced9;font-family:Roboto,Tahoma,sans-serif;Margin-left:20px;Margin-right:20px class="emb-logo-margin-box logo"align=center>\
		  <div class=logo-center align=center id=emb-email-header><img alt=""src=https://i1.createsend1.com/ei/t/84/596/C7A/125510/csfinal/lessons-live-logo.png style=display:block;height:auto;width:100%;border:0;max-width:232px width=232></div></div><!--[if (mso)|(IE)]><![endif]--></div></div><div>\
		  <div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);overflow-wrap:break-word;word-wrap:break-word;word-break:break-word"class="layout one-col fixed-width stack"><div style=border-collapse:collapse;display:table;width:100%;background-color:#fff class=layout__inner><!--[if (mso)|(IE)]><table align=center cellpadding=0 cellspacing=0 role=presentation><tr class=layout-fixed-width style=background-color:#fff><td style=width:600px class=w560><![endif]--><div style=text-align:left;color:#787778;font-size:16px;line-height:24px;font-family:Ubuntu,sans-serif class=column>\
		  <div style=Margin-left:20px;Margin-right:20px;Margin-top:24px><div style=mso-line-height-rule:exactly;line-height:20px;font-size:1px> </div></div><div style=Margin-left:20px;Margin-right:20px><div style=mso-line-height-rule:exactly;mso-text-raise:11px;vertical-align:middle><h1 style=Margin-top:0;Margin-bottom:0;font-style:normal;font-weight:400;color:#565656;font-size:30px;line-height:38px;text-align:center><strong>Welcome to Lessons.Live!</strong></h1\>\
		  <p style=Margin-top:20px;Margin-bottom:20px> <br>Hello!  Welcome to Lessons.Live, the premiere online music lessons application offering quick and easy scheduling, video sharing, file sharing and live chat directly with world-class musicians. </div></div><div style=Margin-left:20px;Margin-right:20px><div style=mso-line-height-rule:exactly;line-height:10px;font-size:1px> </div></div><div style=Margin-left:20px;Margin-right:20px><div style=Margin-bottom:20px;text-align:center class="btn btn--flat btn--large"><!--[if !mso]-->\
		  <a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/ style="border-radius:4px;display:inline-block;font-size:14px;font-weight:700;line-height:24px;padding:12px 24px;text-align:center;text-decoration:none!important;transition:opacity .1s ease-in;color:#fff!important;background-color:#1565c0;font-family:Ubuntu,sans-serif"target=_blank>SCHEDULE FIRST LESSON!</a>\
		  <!--[endif]--><!--[if mso]><p style=line-height:0;margin:0> </p><v:roundrect xmlns:v=urn:schemas-microsoft-com:vml href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/ style=width:224px arcsize=9% fillcolor=#1565C0 stroke=f><v:textbox style=mso-fit-shape-to-text:t inset=0px,11px,0px,11px><center style=font-size:14px;line-height:24px;color:#fff;font-family:Ubuntu,sans-serif;font-weight:700;mso-line-height-rule:exactly;mso-text-raise:4px>SCHEDULE FIRST LESSON!</center></v:textbox></v:roundrect><![endif]--></div></div>\
		  <div style=Margin-left:20px;Margin-right:20px><div style=mso-line-height-rule:exactly;line-height:10px;font-size:1px> </div></div><div style=Margin-left:20px;Margin-right:20px;Margin-bottom:24px><div style=mso-line-height-rule:exactly;line-height:5px;font-size:1px> </div></div></div><!--[if (mso)|(IE)]><![endif]--></div></div><div style=mso-line-height-rule:exactly;line-height:10px;font-size:10px> </div><div role=contentinfo><div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);overflow-wrap:break-word;word-wrap:break-word;word-break:break-word"class="layout email-footer stack">\
		  <div style=border-collapse:collapse;display:table;width:100% class=layout__inner><!--[if (mso)|(IE)]><table align=center cellpadding=0 cellspacing=0 role=presentation><tr class=layout-email-footer><td style=width:400px valign=top class=w360><![endif]--><div style="text-align:left;font-size:12px;line-height:19px;color:#bdbdbd;font-family:Ubuntu,sans-serif;Float:left;max-width:400px;min-width:320px;width:320px;width:calc(8000% - 47600px)"class="column wide"><div style=Margin-left:20px;Margin-right:20px;Margin-top:10px;Margin-bottom:10px><table class=email-footer__links role=presentation style=border-collapse:collapse;table-layout:fixed emb-web-links="">\
		  <tr role=navigation><td emb-web-links=""style=padding:0;width:26px><a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-y/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=Facebook src=https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png style=border:0 width=26 height=26></a><td emb-web-links=""style="padding:0 0 0 3px;width:26px">\
		  <a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-j/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=Twitter src=https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png style=border:0 width=26 height=26></a><td emb-web-links=""style="padding:0 0 0 3px;width:26px"><a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-t/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=YouTube src=https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png style=border:0 width=26 height=26></a><td emb-web-links=""style="padding:0 0 0 3px;width:26px">\
		  <a href=https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-i/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank><img alt=Instagram src=https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png style=border:0 width=26 height=26></a></table><div style=font-size:12px;line-height:19px;Margin-top:20px><div>©2020 Lessons.Live - All Rights Reserved</div></div><div style=font-size:12px;line-height:19px;Margin-top:18px></div><!--[if mso]> <![endif]--></div></div><!--[if (mso)|(IE)]><td style=width:200px valign=top class=w160><![endif]-->\
		  <div style="text-align:left;font-size:12px;line-height:19px;color:#bdbdbd;font-family:Ubuntu,sans-serif;Float:left;max-width:320px;min-width:200px;width:320px;width:calc(72200px - 12000%)"class="column narrow"><div style=Margin-left:20px;Margin-right:20px;Margin-top:10px;Margin-bottom:10px></div></div\
		  ><!--[if (mso)|(IE)]><![endif]--></div></div><div style="Margin:0 auto;max-width:600px;min-width:320px;width:320px;width:calc(28000% - 167400px);overflow-wrap:break-word;word-wrap:break-word;word-break:break-word"class="layout email-footer one-col"><div style=border-collapse:collapse;display:table;width:100% class=layout__inner><!--[if (mso)|(IE)]>\
		  <table align=center cellpadding=0 cellspacing=0 role=presentation><tr class=layout-email-footer><td style=width:600px class=w560><![endif]--><div style=text-align:left;font-size:12px;line-height:19px;color:#bdbdbd;font-family:Ubuntu,sans-serif class=column><div style=Margin-left:20px;Margin-right:20px;Margin-top:10px;Margin-bottom:10px><div style=font-size:12px;line-height:19px><a href=https://lessonslive.createsend1.com/t/t-u-nujyuhy-l-d/ style="text-decoration:underline;transition:opacity .1s ease-in;color:#bdbdbd"target=_blank>Unsubscribe</a></div></div></div><!--[if (mso)|(IE)]><![endif]--></div></div></div><div style=line-height:40px;font-size:40px> </div></div></table>',
      }
    }).then(() => console.log('Queued email for delivery!'));
    // Redirect to dashboard
    yield history.push('/app');
  } catch (error) {
    yield put(registerWithEmailFailure(error));
  }
}

function* logoutSaga() {
  try {
    yield call(firebaseAuth.signOut);
    yield put(logoutSuccess());
    yield put(profileReset());

    // Redirect to home
    yield history.replace('/');
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

function* syncUserSaga() {
  const channel = yield call(firebaseAuth.channel);
  while (true) {
    const { user } = yield take(channel);
    if (user) {
      yield put(syncUser(user));
      const snapshot = yield call(firebaseRsfFirestore.getDocument, 'users/' + user.uid);
      yield put(profileUpdate(snapshot.data()));
    } else {
      yield put(syncUser(null));
    }
  }
}

function* createUserSaga({ credential }) {
  try {
    const userData = {
      email: credential.email,
      displayName: credential.displayName,
      avatarUrl: credential.photoURL,
      role: 'regular',
      username: randomUsername.generate(),
      bio: '',
      headline: '',
      uid: credential.uid
    };

    yield call(firebaseRsfFirestore.setDocument, 'users/' + credential.uid, userData);

    yield put(createUserSuccess(credential));
  } catch (error) {
    yield put(createUserFailure(error));
  }
}

function* passwordForgetSaga({ email }) {
  try {
    yield call(firebaseAuth.sendPasswordResetEmail, email);
    yield put(passwordForgetSuccess());
  } catch (error) {
    yield put(passwordForgetFailure(error));
  }
}


//= ====================================
//  WATCHERS
//-------------------------------------

function* loginRootSaga() {
  yield fork(syncUserSaga);
  yield all([
    takeEvery(LOGIN_REQUEST, loginSaga),
    takeEvery(SOCIAL_SIGNUP_REQUEST, socialSignUpSaga),
    takeEvery(LOGIN_WITH_EMAIL_REQUEST, loginWithEmailSaga),
    takeEvery(REGISTER_WITH_EMAIL_REQUEST, registerWithEmailSaga),
    takeEvery(REGISTER_SUCCESS, createUserSaga),
    takeEvery(LOGOUT_REQUEST, logoutSaga),
    takeEvery(PASSWORD_FORGET_REQUEST, passwordForgetSaga)
  ]);
}

const authSagas = [
  fork(loginRootSaga),
];

export default authSagas;
