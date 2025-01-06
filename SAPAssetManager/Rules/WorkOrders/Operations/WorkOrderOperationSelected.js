import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationSelected(clientAPI) {
    return CommonLibrary.getStateVariable(clientAPI, 'selectAllActive', 'WorkOrderOperationsListViewPage');
}
