import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';

export default function ObjectCardSecondaryButtonOnPress(context) {
    let getStatusOptionsPromise;
    if (IsOperationLevelAssigmentType(context)) {
        //My Operation Secondary Button
        getStatusOptionsPromise = OperationChangeStatusOptions(context);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        //My SubOperation Secondary Button
        getStatusOptionsPromise = SubOperationChangeStatusOptions(context);
    } else {
        //My Work Order Secondary Button
        getStatusOptionsPromise = WorkOrderChangeStatusOptions(context);
    }
    return getStatusOptionsPromise.then(items => {
        for (let x = 0; x < items.length; x++) {
            if (items[x].TransitionType === 'S' || items[x].TransitionType === 'N') {
                return context.executeAction(items[x].OnPress);
            }
        }
        return '';
    });
}
