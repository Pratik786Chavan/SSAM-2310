import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ServiceItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceItems/ServiceItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ServiceItemDetailsSection');
}
