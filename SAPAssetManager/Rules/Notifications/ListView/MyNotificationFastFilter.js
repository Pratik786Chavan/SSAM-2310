import libCommon from '../../Common/Library/CommonLibrary';

//initialize the quick filter to only show My Notifications
export default function MyNotificationFastFilter(context) {
    //State variable when navigating to Notification List View screen from the My Notification section on homepage
    let myNotificationListView = libCommon.getStateVariable(context, 'MyNotificationListView');
    if (myNotificationListView === true) {
        let user = libCommon.getSapUserName(context);
        const started = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'ReportedBy', undefined, ["ReportedBy eq '" + user + "' or NotifMobileStatus_Nav/MobileStatus eq '" + started + "'"], true, context.localizeText('sort_filter_prefix'), [context.localizeText('my_notifications_filter')])];
    }
    return [];
}
