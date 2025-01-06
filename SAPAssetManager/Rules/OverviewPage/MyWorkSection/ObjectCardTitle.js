import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

//My Work Section Object Card Title
export default function ObjectCardTitle(context) {
    //My Operation Title
    if (IsOperationLevelAssigmentType(context)) {
        if (context.binding.OperationShortText) {
            return context.binding.OperationShortText + ' - ' + context.binding.OperationNo;
        } else {
            return context.binding.OperationNo || '-';
        }
    } else if (IsSubOperationLevelAssigmentType(context)) {
        //SupOpertaion Title
        if (context.binding.OperationShortText) {
            return context.binding.OperationShortText + ' - ' + context.binding.SubOperationNo;
        } else {
            return context.binding.SubOperationNo || '-';
        }
    } else {
        //My Work Order Title
        if (context.binding.OrderDescription) {
            return context.binding.OrderDescription + ' - ' + context.binding.OrderId;
        } else {
            return context.binding.OrderId || '-';
        }
    }
}
