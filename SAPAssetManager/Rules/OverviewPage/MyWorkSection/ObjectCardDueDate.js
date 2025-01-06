import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderDueDate from '../../WorkOrders/Operations/WorkOrderDueDate';
import DueDate from '../../DateTime/DueDate';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

//My Work Section Object Card Due Date
export default function ObjectCardDueDate(context) {
    //My Operation DueDate
    if (IsOperationLevelAssigmentType(context) || IsSubOperationLevelAssigmentType(context)) {
        return WorkOrderDueDate(context);
    } else {
        //My Work Order DueDate
        return DueDate(context);
    }
}
