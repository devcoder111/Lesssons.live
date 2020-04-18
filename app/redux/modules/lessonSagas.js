import {
    call,
    fork,
    put,
    takeEvery,
    all
} from 'redux-saga/effects';
import moment from 'moment';
import {
    firebaseRsfFirestore,
    firebaseFirestoreDb
} from '../../firebase';
import {
    ADD_LESSON
} from '../constants/lessonConstants';
import {
    addLesson
} from '../actions/lessonActions';
import {
    addNotification
} from '../actions/notificationActions';
import { Lesson } from '../../containers/pageListAsync';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function* addLessonSaga({
    user,
    musician,
    start,
    end
}) {

    try {
        const documentData = {
            musician,
            user,
            start,
            end
        };
        const cuser = firebase.auth().currentUser;
        var create_at = moment(new Date()).format('YYYY-MM-DD HH:mm')
        var notification_type = "LESSON_CREATE"
        var status = "unread"


        const scheduleLesson = yield call(firebaseRsfFirestore.addDocument, 'lessons/', documentData);
        const dataForUser = {
            lessonId: scheduleLesson.id,
            start,
            end,
            status,
            notification_type,
        }
        const notifyDocumentForUser = yield put(addNotification(create_at, user, user, dataForUser));
        const notifyDocumentForMusician = yield put(addNotification(create_at, user, musician, dataForUser));

        firebaseFirestoreDb.collection('mail').add({
            to: user.email,
            message: {
                subject: 'Lesson confirmed with ' + musician.displayName + ' - ' + start + ' to ' + end,
                text: 'Your lesson scheduled with ' + musician.displayName + ' from ' + start + ' to ' + end + ' is confirmed.',
                html: `<table class="wrapper" style="border-collapse: collapse; table-layout: fixed; min-width: 320px; width: 100%; background-color: #f0f0f0;" cellspacing="0" cellpadding="0"><tbody><tr><td><div><div class="preheader" style="margin: 0 auto; max-width: 560px; min-width: 280px; width: calc(28000% - 167440px);">
				<div style="border-collapse: collapse; display: table; width: 100%;"><!-- [if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
				<div class="snippet" style="display: table-cell; float: left; font-size: 12px; line-height: 19px; max-width: 280px; min-width: 140px; width: calc(14000% - 78120px); padding: 10px 0 5px 0; color: #bdbdbd; font-family: Ubuntu,sans-serif;"> </div> 
				<!-- [if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]--><div class="webversion" style="display: table-cell; float: left; font-size: 12px; line-height: 19px; max-width: 280px; min-width: 139px; width: calc(14100% - 78680px); padding: 10px 0 5px 0; text-align: right; color: #bdbdbd; font-family: Ubuntu,sans-serif;"> </div> 
				<!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div id="emb-email-header-container" class="header" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px);"><!-- [if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
				<div class="logo emb-logo-margin-box" style="font-size: 26px; line-height: 32px; color: #c3ced9; font-family: Roboto,Tahoma,sans-serif; margin: 6px 20px 20px 20px;" align="center"><div id="emb-email-header" class="logo-center" align="center"><img style="display: block; height: auto; width: 100%; border: 0; max-width: 232px;" src="https://i1.createsend1.com/ei/t/84/596/C7A/134508/csfinal/lessons-live-logo.png" alt="" width="232" /></div></div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div>
				<div class="layout one-col fixed-width stack" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><!-- [if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;">
				<td style="width: 600px" class="w560"><![endif]-->
				<div class="column" style="text-align: left; color: #787778; font-size: 16px; line-height: 24px; font-family: Ubuntu,sans-serif;"><div style="margin-left: 20px; margin-right: 20px; margin-top: 24px;"><div style="mso-line-height-rule: exactly; line-height: 20px; font-size: 1px;"> </div></div><div style="margin-left: 20px; margin-right: 20px;">
				<div style="mso-line-height-rule: exactly; mso-text-raise: 11px; vertical-align: middle;"><h1 style="margin-top: 0; margin-bottom: 0; font-style: normal; font-weight: normal; color: #565656; font-size: 30px; line-height: 38px; text-align: center;"><strong>Lesson Confirmed with ` + musician.displayName + ' </strong></h1><p style="margin-top: 20px; margin-bottom: 20px; text-align:center;"><img width="75px" height="75px" style="border-radius:75px; margin:0 auto;" src="' + musician.avatarUrl + ' " /></p><p style="margin-top: 20px; margin-bottom: 20px;"><strong>Congratulations!</strong> Your lesson with ' + musician.displayName + ' has been confirmed for ' + start + ' to ' + end + `.<br><br>Your lesson room will be open and available for video sharing 10 minutes before your lesson begins.  If you\'d like to chat with your teacher ahead of time, click the link below to enter into your lesson room and chat and share files ahead of your lesson time.</p></div></div>
				<div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 10px; font-size: 1px;"> </div></div><div style="margin-left: 20px; margin-right: 20px;"><div class="btn btn--flat btn--large" style="margin-bottom: 20px; text-align: center;"><a style="border-radius: 4px; display: inline-block; font-size: 14px; font-weight: bold; line-height: 24px; padding: 12px 24px; text-align: center; text-decoration: none !important; transition: opacity 0.1s ease-in; color: #ffffff !important; background-color: #1565c0; font-family: Ubuntu, sans-serif;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/" target="_blank">ENTER LESSON ROOM</a>
				<!--[endif]--> <!-- [if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/" style="width:198px" arcsize="9%" fillcolor="#1565C0" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Ubuntu,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">ENTER LESSON ROOM</center></v:textbox></v:roundrect><![endif]--></div></div><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 10px; font-size: 1px;"> </div></div>
				<div style="margin-left: 20px; margin-right: 20px; margin-bottom: 24px;"><div style="mso-line-height-rule: exactly; line-height: 5px; font-size: 1px;"> </div></div></div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div style="mso-line-height-rule: exactly; line-height: 10px; font-size: 10px;"> </div>
				<div><div class="layout email-footer stack" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><!-- [if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]--><div class="column wide" style="text-align: left; font-size: 12px; line-height: 19px; color: #bdbdbd; font-family: Ubuntu,sans-serif; float: left; max-width: 400px; min-width: 320px; width: calc(8000% - 47600px);">
				<div style="margin: 10px 20px 10px 20px;"><table class="email-footer__links" style="border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="padding: 0; width: 26px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-y/" target="_blank">
				<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" alt="Facebook" width="26" height="26" /></a></td><td style="padding: 0 0 0 3px; width: 26px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-j/" target="_blank"><img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" alt="Twitter" width="26" height="26" /></a></td><td style="padding: 0 0 0 3px; width: 26px;">
				<a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-t/" target="_blank"><img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" alt="YouTube" width="26" height="26" /></a></td><td style="padding: 0 0 0 3px; width: 26px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-i/" target="_blank"><img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" alt="Instagram" width="26" height="26" /></a></td></tr></tbody></table>
				<div style="font-size: 12px; line-height: 19px; margin-top: 20px;"><div>©2020 Lessons.Live - All Rights Reserved</div></div><div style="font-size: 12px; line-height: 19px; margin-top: 18px;"> </div> <!-- [if mso]>&nbsp;<![endif]--></div></div> <!-- [if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]--><div class="column narrow" style="text-align: left; font-size: 12px; line-height: 19px; color: #bdbdbd; font-family: Ubuntu,sans-serif; float: left; max-width: 320px; min-width: 200px; width: calc(72200px - 12000%);"> </div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div>
				<div class="layout one-col email-footer" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><!-- [if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]--><div class="column" style="text-align: left; font-size: 12px; line-height: 19px; color: #bdbdbd; font-family: Ubuntu,sans-serif;"><div style="margin: 10px 20px 10px 20px;"><div style="font-size: 12px; line-height: 19px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-u-nujyuhy-l-d/" target="_blank">Unsubscribe</a></div></div></div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div></div>
				<div style="line-height: 40px; font-size: 40px;"> </div></div></td></tr></tbody></table>`,
            }
        }).then(() => console.log('Queued email for delivery!'));

        firebaseFirestoreDb.collection('mail').add({
            to: musician.email,
            message: {
                subject: 'Lesson confirmed with ' + user.displayName + ' - ' + start + ' to ' + end,
                text: 'A lesson has been scheduled with ' + user.displayName + ' from ' + start + ' to ' + end,
                html: `<table class="wrapper" style="border-collapse: collapse; table-layout: fixed; min-width: 320px; width: 100%; background-color: #f0f0f0;" cellspacing="0" cellpadding="0"><tbody><tr><td><div><div class="preheader" style="margin: 0 auto; max-width: 560px; min-width: 280px; width: calc(28000% - 167440px);">
				<div style="border-collapse: collapse; display: table; width: 100%;"><!-- [if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
				<div class="snippet" style="display: table-cell; float: left; font-size: 12px; line-height: 19px; max-width: 280px; min-width: 140px; width: calc(14000% - 78120px); padding: 10px 0 5px 0; color: #bdbdbd; font-family: Ubuntu,sans-serif;"> </div> 
				<!-- [if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]--><div class="webversion" style="display: table-cell; float: left; font-size: 12px; line-height: 19px; max-width: 280px; min-width: 139px; width: calc(14100% - 78680px); padding: 10px 0 5px 0; text-align: right; color: #bdbdbd; font-family: Ubuntu,sans-serif;"> </div> 
				<!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div id="emb-email-header-container" class="header" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px);"><!-- [if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
				<div class="logo emb-logo-margin-box" style="font-size: 26px; line-height: 32px; color: #c3ced9; font-family: Roboto,Tahoma,sans-serif; margin: 6px 20px 20px 20px;" align="center"><div id="emb-email-header" class="logo-center" align="center"><img style="display: block; height: auto; width: 100%; border: 0; max-width: 232px;" src="https://i1.createsend1.com/ei/t/84/596/C7A/134508/csfinal/lessons-live-logo.png" alt="" width="232" /></div></div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div>
				<div class="layout one-col fixed-width stack" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;"><!-- [if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;">
				<td style="width: 600px" class="w560"><![endif]-->
				<div class="column" style="text-align: left; color: #787778; font-size: 16px; line-height: 24px; font-family: Ubuntu,sans-serif;"><div style="margin-left: 20px; margin-right: 20px; margin-top: 24px;"><div style="mso-line-height-rule: exactly; line-height: 20px; font-size: 1px;"> </div></div><div style="margin-left: 20px; margin-right: 20px;">
				<div style="mso-line-height-rule: exactly; mso-text-raise: 11px; vertical-align: middle;"><h1 style="margin-top: 0; margin-bottom: 0; font-style: normal; font-weight: normal; color: #565656; font-size: 30px; line-height: 38px; text-align: center;"><strong>Lesson Confirmed with ` + user.displayName + ' </strong></h1><p style="margin-top: 20px; margin-bottom: 20px; text-align:center;"><img width="75px" height="75px" style="border-radius:50px; margin:0 auto;" src="' + user.avatarUrl + ' " /></p><p style="margin-top: 20px; margin-bottom: 20px;"><strong>Congratulations!</strong> Your lesson with ' + user.displayName + ' has been confirmed for ' + start + ' to ' + end + `.<br><br>Your lesson room will be open and available for video sharing 10 minutes before your lesson begins.  If you\'d like to chat with your student ahead of time, click the link below to enter into your lesson room and chat and share files ahead of your lesson time.</p></div></div>
				<div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 10px; font-size: 1px;"> </div></div><div style="margin-left: 20px; margin-right: 20px;"><div class="btn btn--flat btn--large" style="margin-bottom: 20px; text-align: center;"><a style="border-radius: 4px; display: inline-block; font-size: 14px; font-weight: bold; line-height: 24px; padding: 12px 24px; text-align: center; text-decoration: none !important; transition: opacity 0.1s ease-in; color: #ffffff !important; background-color: #1565c0; font-family: Ubuntu, sans-serif;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/" target="_blank">ENTER LESSON ROOM</a>
				<!--[endif]--> <!-- [if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-r/" style="width:198px" arcsize="9%" fillcolor="#1565C0" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Ubuntu,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">ENTER LESSON ROOM</center></v:textbox></v:roundrect><![endif]--></div></div><div style="margin-left: 20px; margin-right: 20px;"><div style="mso-line-height-rule: exactly; line-height: 10px; font-size: 1px;"> </div></div>
				<div style="margin-left: 20px; margin-right: 20px; margin-bottom: 24px;"><div style="mso-line-height-rule: exactly; line-height: 5px; font-size: 1px;"> </div></div></div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div style="mso-line-height-rule: exactly; line-height: 10px; font-size: 10px;"> </div>
				<div><div class="layout email-footer stack" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><!-- [if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]--><div class="column wide" style="text-align: left; font-size: 12px; line-height: 19px; color: #bdbdbd; font-family: Ubuntu,sans-serif; float: left; max-width: 400px; min-width: 320px; width: calc(8000% - 47600px);">
				<div style="margin: 10px 20px 10px 20px;"><table class="email-footer__links" style="border-collapse: collapse; table-layout: fixed;"><tbody><tr><td style="padding: 0; width: 26px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-y/" target="_blank">
				<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" alt="Facebook" width="26" height="26" /></a></td><td style="padding: 0 0 0 3px; width: 26px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-j/" target="_blank"><img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" alt="Twitter" width="26" height="26" /></a></td><td style="padding: 0 0 0 3px; width: 26px;">
				<a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-t/" target="_blank"><img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" alt="YouTube" width="26" height="26" /></a></td><td style="padding: 0 0 0 3px; width: 26px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-l-nujyuhy-l-i/" target="_blank"><img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" alt="Instagram" width="26" height="26" /></a></td></tr></tbody></table>
				<div style="font-size: 12px; line-height: 19px; margin-top: 20px;"><div>©2020 Lessons.Live - All Rights Reserved</div></div><div style="font-size: 12px; line-height: 19px; margin-top: 18px;"> </div> <!-- [if mso]>&nbsp;<![endif]--></div></div> <!-- [if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]--><div class="column narrow" style="text-align: left; font-size: 12px; line-height: 19px; color: #bdbdbd; font-family: Ubuntu,sans-serif; float: left; max-width: 320px; min-width: 200px; width: calc(72200px - 12000%);"> </div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div>
				<div class="layout one-col email-footer" style="margin: 0 auto; max-width: 600px; min-width: 320px; width: calc(28000% - 167400px); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse; display: table; width: 100%;"><!-- [if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]--><div class="column" style="text-align: left; font-size: 12px; line-height: 19px; color: #bdbdbd; font-family: Ubuntu,sans-serif;"><div style="margin: 10px 20px 10px 20px;"><div style="font-size: 12px; line-height: 19px;"><a style="text-decoration: underline; transition: opacity 0.1s ease-in; color: #bdbdbd;" href="https://lessonslive.createsend1.com/t/t-u-nujyuhy-l-d/" target="_blank">Unsubscribe</a></div></div></div> <!-- [if (mso)|(IE)]></td></tr></table><![endif]--></div></div></div>
				<div style="line-height: 40px; font-size: 40px;"> </div></div></td></tr></tbody></table>`,
            }
        }).then(() => console.log('Queued email for delivery!'));

        // const eventDataWithId = eventData.set('docId', document.id);
    } catch (error) {
        console.log('addEventSaga error :', error);
        // yield put(passwordForgetFailure(error));
    }
}

//= ====================================
//  WATCHERS
//--------------------------------------

function* lessonRootSaga() {
    yield all([
        takeEvery(ADD_LESSON, addLessonSaga),
    ]);
}

const lessonSagas = [
    fork(lessonRootSaga),
];

export default lessonSagas;