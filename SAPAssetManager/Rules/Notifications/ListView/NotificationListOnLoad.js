import libCommon from '../../Common/Library/CommonLibrary';
import setCaption from './NotificationListSetCaption';

//Rule to call the caption again to load the count for quickFilter
export default function NotificationListOnLoad(context) {
    let myNotificationListView = libCommon.getStateVariable(context, 'MyNotificationListView');
    if (myNotificationListView === true) {
        libCommon.removeStateVariable(context, 'MyNotificationListView');
        return setCaption(context);
    }
}
