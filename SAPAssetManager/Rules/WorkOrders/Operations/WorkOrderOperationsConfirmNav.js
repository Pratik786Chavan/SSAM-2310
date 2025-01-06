import libCommon from '../../Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import GenerateLocalConfirmationNum from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import GenerateTimeEntryID from '../../TimeSheets/GenerateTimeEntryID';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import IsOperationLevelAssigmentType from './IsOperationLevelAssigmentType';

export default function WorkOrderOperationsConfirmNav(context) {
    context.getPageProxy().showActivityIndicator();
    libCommon.setStateVariable(context, 'OperationsToConfirm', []);
    const selectedOperations = libCommon.getStateVariable(context, 'selectedOperations');
    const removedOperations = libCommon.getStateVariable(context, 'removedOperations');
    const isSelectAll = libCommon.getStateVariable(context, 'selectAllActive', 'WorkOrderOperationsListViewPage');
    if (selectedOperations.length === 0) {
        context.getPageProxy().dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsNoSelectedMessage.action');
    }
    return Promise.all(getConfirmationsDataPromises(context, selectedOperations)).then(() => {
        let actionBinding = {
            selectedOperations,
        };
        if (isSelectAll) {
            libCommon.setStateVariable(context, 'OperationsToRemove', [...removedOperations]);
        }
        context.getPageProxy().setActionBinding(actionBinding);
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsConfirmNav.action');
    }).finally(() => {
        context.getPageProxy().dismissActivityIndicator();
    });
}

function getConfirmationsDataPromises(context, selectedOperations) {
    const isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
    return selectedOperations.map((selectedContext, i) => {
        return SupervisorLibrary.checkReviewRequired(context, selectedContext.binding).then(isReviewRequired => {
            isReviewRequired = isReviewRequired && IsOperationLevelAssigmentType(context);
            let keyGenerationAction;
            if (isTimesheetEnabled) {
                keyGenerationAction = GenerateTimeEntryID(context, i);
            } else {
                keyGenerationAction = GenerateLocalConfirmationNum(context, i);
            }

            return keyGenerationAction.then(key => {
                let binding = selectedContext.binding;
                const duration = calculateDuration(context);
                let startTime = new Date();

                if (binding.UserTimeEntry_Nav && binding.UserTimeEntry_Nav.length) {
                    startTime = binding.UserTimeEntry_Nav.reduce((acc, item) => {
                        if (item.PreferenceGroup === 'START_TIME') {
                            return item.PreferenceValue ? new Date(item.PreferenceValue) : acc;
                        } else if (item.PreferenceGroup === 'END_TIME') {
                            return new Date();
                        }
                        return acc;
                    }, new Date());
                } else {
                    startTime.setMinutes(startTime.getMinutes() - duration);
                }

                let confirmCreateProperties = {
                    ...binding,
                    OperationReadlink: binding['@odata.readLink'],
                    ConfirmationNum: key,
                    SubOperation: binding.SubOperation || '',
                    VarianceReason: '',
                    StartTime: startTime,
                    ActualDuration: duration.toString(),
                    ActualDurationUOM: 'MIN',
                    ActualWork: duration.toString(),
                    ActualWorkUOM: 'MIN',
                    ActivityType: binding.ActivityType || '',
                    AccountingIndicator: '',
                    Description: '',
                    RemainingWorkUOM: 'H',
                    CompleteFlag: '',
                    FinalConfirmation: isReviewRequired ? '' : 'X',
                    Operation: binding.OperationNo,
                    OrderID: binding.OrderId,
                    PersonnelNumber: '',
                    Plant: binding.MainWorkCenterPlant || '',
                    ReverseIndicator: '',
                    OrderType: binding.WOHeader && binding.WOHeader.OrderType,
                    OperationMobileStatus_Nav: binding.OperationMobileStatus_Nav,
                    OperationShortText: binding.OperationShortText,
                    isReviewRequired: isReviewRequired,
                    Hours: 0.15,
                };
                let operationsToConfirm = libCommon.getStateVariable(context, 'OperationsToConfirm') || [];
                operationsToConfirm.push({
                    ...confirmCreateProperties,
                    WorkOrderHeader: binding.WOHeader,
                });
                libCommon.setStateVariable(context, 'OperationsToConfirm', operationsToConfirm);
            });
        });
    });
}

function calculateDuration(context) {
    const validNumbers = [1,5,10,15,30];
    let duration;

    if (TimeSheetsIsEnabled(context)) {
        duration = libCommon.getAppParam(context, 'TIMESHEET', 'CATSMinutesInterval');
    } else {
        duration = libCommon.getAppParam(context, 'PMCONFIRMATION', 'LaborTimeMinutesInterval');
    }

    duration = parseInt(Number(duration));

    if ((validNumbers.includes(duration))) {
        return duration;
    }

    return 15;
}
