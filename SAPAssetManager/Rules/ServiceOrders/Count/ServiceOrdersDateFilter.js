import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Getting count of all current day Service Orders
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateFilter(context) {
    const defaultDate = libWO.getActualDate(context);

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.countOrdersByDateAndStatus(context, [], defaultDate);
    } else {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                let options = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=${dateFilter} and ${types}`;
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, options));
            }); 
        });
    }
}
