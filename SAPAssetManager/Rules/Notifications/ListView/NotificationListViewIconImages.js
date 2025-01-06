import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';


export default function NotificationListViewIconImages(context) {
    var iconImage = [];
    
    // check if this Notification has any docs
    const docIcon = AttachedDocumentIcon(context, context.binding.NotifDocuments);
    if (docIcon) {
        iconImage.push(docIcon);
    }

    const {Tasks, Items, Activities} = context.binding;

    const localTasksExist = Tasks && Tasks.some(task => task['@sap.isLocal']);
    const localItemsExist = Items && Items.some(item => item['@sap.isLocal']);
    const localActivitiesExist = Activities && Activities.some(activity => activity['@sap.isLocal']);

    // check if this Notification has been locally created
    if (libCommon.getTargetPathValue(context,'#Property:@sap.hasPendingChanges') || libCommon.getTargetPathValue(context, '#Property:NotifMobileStatus_Nav/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal') || localTasksExist || localItemsExist || localActivitiesExist) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        return iconImage;
    }

    // Check for local changes to tasks, causes, and activities at the item level only if the previous check at notification level has not passed
    if (Items) {
        for (let i = 0; i < Items.length; i++) {
            const localItemTasksExist = Items[i].ItemTasks.some(task => task['@sap.isLocal']);
            const localItemCausesExist = Items[i].ItemCauses.some(cause => cause['@sap.isLocal']);
            const localItemActivitiesExist = Items[i].ItemActivities.some(activity => activity['@sap.isLocal']);
            if (localItemTasksExist || localItemCausesExist || localItemActivitiesExist) {
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return iconImage;
            }
        }
    }

    return iconImage;
}

