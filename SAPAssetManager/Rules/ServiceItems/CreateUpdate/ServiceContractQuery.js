import ServiceOrderSalesOrgValue from '../../ServiceOrders/CreateUpdate/ServiceOrderSalesOrgValue';
import ServiceOrderSalesOrg from '../../ServiceOrders/ServiceOrderSalesOrg';
import IsItemCreateFromServiceItemsList from './IsItemCreateFromServiceItemsList';

/**
* Query options for service contract based on selected service order
* @param {IClientAPI} clientAPI
*/
export default async function ServiceContractQuery(clientAPI, serviceOrderId) {
    let query = '$orderby=ObjectID';
    let salesOrg;
    if (!IsItemCreateFromServiceItemsList(clientAPI)) {
        salesOrg = await ServiceOrderSalesOrgValue(clientAPI);
    } else {
        salesOrg = await ServiceOrderSalesOrg(clientAPI, serviceOrderId);
    }
    if (salesOrg) {
        query += `&$filter=SalesOrg eq '${salesOrg}'`;
    }
    return query;
}
