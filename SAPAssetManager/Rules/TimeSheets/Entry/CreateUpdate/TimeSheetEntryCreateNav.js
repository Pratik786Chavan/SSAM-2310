import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import libCrew from '../../../Crew/CrewLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function TimeSheetEntryCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    let OrderId = '';
    if (!libVal.evalIsEmpty(clientAPI.binding) && !libVal.evalIsEmpty(clientAPI.binding.WorkOrder)) {
        OrderId = clientAPI.binding.OrderId;
    }
    if (userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        let pageProxy = clientAPI;
        let actionContext = pageProxy;
        if (typeof pageProxy.getPageProxy === 'function') {
            pageProxy = clientAPI.getPageProxy();
            actionContext = pageProxy.getActionBinding();
        }
        if (libVal.evalIsEmpty(actionContext)) {
            actionContext = clientAPI.binding;
        }
        let personnelNumber = '';
        if (!libVal.evalIsEmpty(actionContext) && Object.prototype.hasOwnProperty.call(actionContext,'Employee')) {
            personnelNumber = actionContext.Employee.PersonnelNumber;
        }
        let date;
        if (!libVal.evalIsEmpty(actionContext) && Object.prototype.hasOwnProperty.call(actionContext,'Date')) {
            date = actionContext.Date;
        } else if (!libVal.evalIsEmpty(actionContext) && Object.prototype.hasOwnProperty.call(actionContext,'WorkDate')) {
            date = actionContext.WorkDate;
        }
        return libCrew.initializeCrewHeader(clientAPI).then( function() { //Initialize today's crew
            let binding = {
                'TimeSheetEmployee': personnelNumber,
                'Date': date,
                'OrderId': OrderId,
            };
            clientAPI.setActionBinding(binding);
            return clientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
        });
    }
    if (!libVal.evalIsEmpty(OrderId)) {
        let binding = {'OrderId': OrderId};
        clientAPI.setActionBinding(binding);
    }
    return clientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
}
