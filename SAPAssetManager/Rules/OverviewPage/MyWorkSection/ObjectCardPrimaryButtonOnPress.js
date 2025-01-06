import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';

export default function ObjectCardPrimaryButtonOnPress(context) {
    let getStatusOptionsPromise;
    if (IsOperationLevelAssigmentType(context)) {
        //My Operation Primary Button
        getStatusOptionsPromise = OperationChangeStatusOptions(context);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        //My SubOperation Primary Button
        getStatusOptionsPromise = SubOperationChangeStatusOptions(context);
    } else {
        //My Work Order Primary Button
        getStatusOptionsPromise = WorkOrderChangeStatusOptions(context);
    }
    return getStatusOptionsPromise.then(items => {
        for (let x = 0; x < items.length; x++) {
            if (items[x].TransitionType === 'P') {
                return context.executeAction(items[x].OnPress);
            }
        }
        return '';
    });
}
