import libCommon from '../../../Common/Library/CommonLibrary';

export default function OperationalItemsUntaggingListViewNav(context) {
    libCommon.setStateVariable(context, 'operationalItemsListPreselectedTabIndex', 2);
    return context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemsListViewNav.action');
}
