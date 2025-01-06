import Logger from '../../Log/Logger';
import setCaption from '../WorkOrderListViewCaption';
import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderListViewOnPageLoad(pageClientAPI) {
    let MyWorkOrderListView = libCom.getStateVariable(pageClientAPI, 'MyWorkOrderListView');
    if (MyWorkOrderListView === true) {
        libCom.removeStateVariable(pageClientAPI, 'MyWorkOrderListView');
        return;
    }
    setCaption(pageClientAPI);
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderListViewOnPageLoad called');
    libCom.removeStateVariable(pageClientAPI, 'SupervisorAssignmentFilter');
}
