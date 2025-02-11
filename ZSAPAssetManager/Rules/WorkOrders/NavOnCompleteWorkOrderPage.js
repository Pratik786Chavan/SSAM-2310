import IsWONotificationVisible from '../../../SAPAssetManager/Rules/WorkOrders/Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from '../../../SAPAssetManager/Rules/WorkOrders/Complete/WorkOrderCompletionLibrary';
import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import { ChecklistLibrary } from '../../../SAPAssetManager/Rules/Checklists/ChecklistLibrary';

export default function NavOnCompleteWorkOrderPage(context, actionBinding) {
    let binding = actionBinding || libCommon.getBindingObject(context);
    if (!binding && context.getActionBinding()) {
        binding = context.getActionBinding();
    }

    return zCheckEAMChecklistCompletion(context).then(function (result) {
        if (result === false) {
            return context.executeAction("/ZSAPAssetManager/Actions/Checklists/ZUnfinishedChecklistError.action");
        }
        return ChecklistLibrary.allowWorkOrderComplete(context, binding.HeaderEquipment, binding.HeaderFunctionLocation).then(async results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                WorkOrderCompletionLibrary.getInstance().setCompletionFlow('');
                await WorkOrderCompletionLibrary.getInstance().initSteps(context);
                WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);
                return IsWONotificationVisible(context, binding, 'Notification').then((notification) => {
                    if (notification) {
                        WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                            visible: true,
                            data: JSON.stringify(notification),
                            link: notification['@odata.editLink'],
                            initialData: JSON.stringify(notification),
                        });
                    } else {
                        WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                            visible: false,
                        });
                    }
                    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);
                    return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
                });
            }
            return false;
        });
    });
}


export function zCheckEAMChecklistCompletion(context) {
    if (context.binding.EAMChecklist_Nav?.length > 0) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/EAMChecklist_Nav`, [], '$expand=InspectionLot_Nav').then(result => {

            if (result.some((chklst) => (chklst.InspectionLot_Nav.ValuationStatus === ''))) {
                return Promise.resolve(false);
            }
            else {
                return Promise.resolve(true);
            }
        });

    }
    return Promise.resolve(true);
}

