import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function WorkOrderOperationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/WorkOrderOperationDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WorkOrderOperationDetailsSection');
}
