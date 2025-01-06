import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Work orders, Operations or Sub-Operations in STARTED or HOLD status
* @param {IClientAPI} context
*/
export default function InProgressCount(context) {
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()); 

    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
        let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}')`;
        
        return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders',libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOption));
    } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        let queryOption = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}')`;

        return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption));
    } else if (MobileStatusLibrary.isSubOperationStatusChangeable(context)) {
        let queryOption = `$filter=(SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}' or SubOpMobileStatus_Nav/MobileStatus eq '${HOLD}')`;

        return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderSubOperations', queryOption);
    } else {
        return '0';
    }
}

