import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function SubOperationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/SubOperation/SubOperationDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WorkOrderOperationDetailsSection');
}
