import libCom from '../../Common/Library/CommonLibrary';
import MyWorkSectionFilterQuery from '../../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

export default async function WorkOrdersListViewDefaultFilters(context) {
    let filters = [];
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const DISAPPROVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    const APPROVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());

    filters.push(context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Priority', undefined, ['Priority'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('priority')]));
    if (libCom.getStateVariable(context, 'KPI-InProgress')) {
        libCom.removeStateVariable(context, 'KPI-InProgress');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Started', undefined, [`OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}'`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Open')) {
        libCom.removeStateVariable(context, 'KPI-Open');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', undefined, [`(OrderMobileStatus_Nav/MobileStatus ne '${STARTED}' and OrderMobileStatus_Nav/MobileStatus ne '${HOLD}' and OrderMobileStatus_Nav/MobileStatus ne '${COMPLETED}')`], true));
    }
    if (libCom.getStateVariable(context, 'KPI-Completed')) {
        libCom.removeStateVariable(context, 'KPI-Completed');
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Completed', undefined, [`OrderMobileStatus_Nav/MobileStatus eq '${COMPLETED}'`], true));
    }
    let myWorkOrderListView = libCom.getStateVariable(context, 'MyWorkOrderListView');
    if (myWorkOrderListView === true) {
        let filter = await MyWorkSectionFilterQuery(context, '');
        return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'PersonnelNum', undefined, [filter], true, context.localizeText('sort_filter_prefix'), [context.localizeText('my_work')])];
    }
    if ((SupervisorLibrary.isSupervisorFeatureEnabled(context)) && context.binding && libCom.isDefined(context.binding.isSupervisorWorkOrdersList)) { 
        filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'OrderMobileStatus_Nav/MobileStatus', undefined, [REVIEW, DISAPPROVED, APPROVED], false, undefined, [context.localizeText(REVIEW), context.localizeText(DISAPPROVED), context.localizeText(APPROVED)]));
    }
    return filters;
}
