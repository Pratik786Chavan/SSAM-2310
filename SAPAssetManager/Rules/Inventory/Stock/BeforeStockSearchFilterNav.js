import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {IPageProxy} context  */
export default function BeforeStockSearchFilterNav(context) {
    const clientData = context.getClientData();
    const day = libCom.getStateVariable(context, 'ActualDate') || new Date(new Date().setHours(0, 0, 0, 0));

    return libWO.dateOrdersFilter(context, day, 'ScheduledStartDate')
        .then(dateFilter => `$filter=${dateFilter}&$expand=Components/Material`)
        .then(query => context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], query))
        .then((/** @type {ObservaleArray<MyWorkOrderHeader>} */ orders) => {
            clientData.todayMaterialsFilter = "(MaterialNum eq '')";
            if (!ValidationLibrary.evalIsEmpty(orders)) {
                const materialNums = Array.from(orders, (/** @type {MyWorkOrderHeader} */ o) => o.Components)
                    .filter((/** @type {MyWorkOrderComponent} */ components) => !ValidationLibrary.evalIsEmpty(components))
                    .flat(1)
                    .map((/** @type {MyWorkOrderComponent} */ orderComponent) => orderComponent.Material ? orderComponent.Material.MaterialNum : orderComponent.MaterialNum)
                    .filter(i => !!i); // skip if no materialNum is present
                const materialFilterTerms = [...(new Set(materialNums))].map(materialNum => `MaterialNum eq '${materialNum}'`);
                clientData.todayMaterialsFilter = `(${materialFilterTerms.join(' or ')})`;
            }
            return context.executeAction('/SAPAssetManager/Actions/Inventory/Stock/StockSearchFilter.action');
        });
}
