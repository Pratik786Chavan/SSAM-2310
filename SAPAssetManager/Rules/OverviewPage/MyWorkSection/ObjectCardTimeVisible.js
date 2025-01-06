import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function ObjectCardTimeVisible(context) {
    return ((TimeSheetsIsEnabled(context) || ConfirmationsIsEnabled(context)) && !IsSubOperationLevelAssigmentType(context));
}
