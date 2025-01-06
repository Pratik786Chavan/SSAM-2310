import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderDetailsNav from '../../WorkOrders/WorkOrderDetailsNav';
import WorkOrderOperationDetailsNav from '../../WorkOrders/Operations/Details/WorkOrderOperationDetailsNav';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationDetailsNav from '../../SubOperations/SubOperationDetailsNav';

//My Work Section Details Nav
export default function ObjectCardDetailsNav(context) {
    //My Operation Details Nav
    if (IsOperationLevelAssigmentType(context)) {
        return WorkOrderOperationDetailsNav(context);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        return SubOperationDetailsNav(context);
    } else {
        //My Work Order Details Nav
        return WorkOrderDetailsNav(context);
    }
}
