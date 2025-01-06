import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function ServiceOrderDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceOrderDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'OrderDetailsSection');
}
