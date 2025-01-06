import Logger from '../../Log/Logger';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';

export default function supervisorOperationsListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderOperationsListViewNav called');
    
    let actionBinding = {
        isSupervisorOperationsList: true,
    };

    const REVIEW = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const DISAPPROVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    const APPROVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    CommonLibrary.setStateVariable(context, 'OPERATIONS_FILTER', "$filter=(OperationMobileStatus_Nav/MobileStatus eq '" + REVIEW + "' or OperationMobileStatus_Nav/MobileStatus eq '" + DISAPPROVED + "' or OperationMobileStatus_Nav/MobileStatus eq '" + APPROVED + "')");

    context.getPageProxy().setActionBinding(actionBinding);
    return OperationMobileStatusLibrary.isAnyOperationStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action');
    });
}
