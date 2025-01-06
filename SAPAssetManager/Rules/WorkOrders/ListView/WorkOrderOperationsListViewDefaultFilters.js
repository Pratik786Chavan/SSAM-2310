import libCom from '../../Common/Library/CommonLibrary';
import MyWorkSectionFilterQuery from '../../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

export default async function WorkOrderOperationsListViewDefaultFilters(context) {
    let filters = [];
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const DISAPPROVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    const APPROVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const TRAVEL = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
    const ONSITE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
    const ACCEPTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
    
    if (libCom.getStateVariable(context, 'KPI-InProgress')) {
        libCom.removeStateVariable(context, 'KPI-InProgress');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Started', undefined, [`OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}'`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Open')) {
        libCom.removeStateVariable(context, 'KPI-Open');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', undefined, [`(OperationMobileStatus_Nav/MobileStatus ne '${STARTED}' and OperationMobileStatus_Nav/MobileStatus ne '${HOLD}' and OperationMobileStatus_Nav/MobileStatus ne '${COMPLETED}')`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Completed')) {
        libCom.removeStateVariable(context, 'KPI-Completed');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Completed', undefined, [`OperationMobileStatus_Nav/MobileStatus eq '${COMPLETED}'`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Recieved')) {
        libCom.removeStateVariable(context, 'KPI-Recieved');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OperationMobileStatus_Nav/MobileStatus', undefined, [RECEIVED], false, undefined, [context.localizeText('received')]));
    }
    if (libCom.getStateVariable(context, 'KPI-NotStarted')) {
        libCom.removeStateVariable(context, 'KPI-NotStarted');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OperationMobileStatus_Nav/MobileStatus', undefined, [ONSITE, TRAVEL, ACCEPTED], false, undefined, [context.localizeText('onsite'), context.localizeText('enroute'), context.localizeText('accepted')]));
    }

    let myOperationListView = libCom.getStateVariable(context, 'MyOperationListView');
    if (myOperationListView === true) {
        let filter = await MyWorkSectionFilterQuery(context, '');
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'ReportedBy', undefined, [filter], true, context.localizeText('sort_filter_prefix'), [context.localizeText('my_work')])];
    }
    if ((SupervisorLibrary.isSupervisorFeatureEnabled(context)) && context.binding && libCom.isDefined(context.binding.isSupervisorOperationsList)) { 
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OperationMobileStatus_Nav/MobileStatus', undefined, [REVIEW, DISAPPROVED, APPROVED], false, undefined, [context.localizeText(REVIEW), context.localizeText(DISAPPROVED), context.localizeText(APPROVED)]));
    }
  
    filters.push(context.createFilterCriteria(context.filterTypeEnum.Sorter, 'OperationNo,OrderId,ObjectKey,OperationMobileStatus_Nav/MobileStatus', undefined, ['OperationNo,OrderId,ObjectKey,OperationMobileStatus_Nav/MobileStatus'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('operation')]));
    return filters;
}
