import libCommon from '../../../Common/Library/CommonLibrary';

export default function OperationalItemsTaggingListViewNav(context) {
    libCommon.setStateVariable(context, 'operationalItemsListPreselectedTabIndex', 1);
    return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemsListViewNav.action');
}
