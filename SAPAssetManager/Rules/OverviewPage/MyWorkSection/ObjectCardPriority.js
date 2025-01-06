import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

//My Work Section Object Card Priority
export default function ObjectCardPriority(context) {
    //My Operation OrderId since operations don't have priorities
    if (IsOperationLevelAssigmentType(context)) {
        return context.binding.OrderId;
    } else if (IsSubOperationLevelAssigmentType(context)) {
        //SupOpertaion Mobile Status
        return context.binding.OrderId + ' - ' + context.binding.OperationNo;
    } else {
        //My Work Order Priority
        return context.binding.WOPriority.PriorityDescription;
    }
}
