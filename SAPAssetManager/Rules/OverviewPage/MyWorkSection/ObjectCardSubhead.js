import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import { WorkOrderEventLibrary } from '../../WorkOrders/WorkOrderLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationMobileStatus from '../../MobileStatus/SubOperationMobileStatus';

//My Work Section Object Card Subhead
export default function ObjectCardSubhead(context) {
    if (IsOperationLevelAssigmentType(context)) {
        return WorkOrderEventLibrary.getWorkOrderOperationMobileStatusText(context);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        //SupOpertaion Mobile Status
        return SubOperationMobileStatus(context);
    } else {
        return WorkOrderEventLibrary.getWorkOrderMobileStatusText(context);
    }
}
