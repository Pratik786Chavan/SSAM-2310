import libCom from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ItemDetailsTargetKeyValues from '../Item/ItemDetailsTargetKeyValues';

/** @param {IClientAPI} context  */
export default function ItemDetailsPage(context) {
    const headerType = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const headers = ['ReservationHeader', 'PurchaseOrderHeader', 'StockTransportOrderHeader', 'ProductionOrderHeader', 'PurchaseRequisitionHeader'];
    /** @type {IPageProxy} */
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding();
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);

    let entitySet = '';
    let query = '';

    if (headerType === 'MaterialDocument') {
        libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', true);
    } else {
        libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', false);
    }

    if (headers.includes(headerType) && type === 'MaterialDocItem') {
        libCom.setStateVariable(context, 'ClosePageCount', 2);
    } else {
        libCom.setStateVariable(context, 'ClosePageCount', 3);
    }

    if (type === 'PurchaseOrderItem') {
        entitySet = 'PurchaseOrderItems';
        query = `$filter=PurchaseOrderId eq '${binding.PurchaseOrderId}'&$expand=ScheduleLine_Nav,MaterialPlant_Nav,POSerialNumber_Nav,PurchaseOrderHeader_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;
    } else if (type === 'PurchaseRequisitionItem') {
        entitySet = 'PurchaseRequisitionItems';
        query = `$filter=PurchaseReqNo eq '${binding.PurchaseReqNo}'&$expand=PurchaseRequisitionLongText_Nav,PurchaseRequisitionAddress_Nav,PurchaseRequisitionAcctAsgn_Nav,PurchaseRequisitionHeader_Nav&$orderby=PurchaseReqItemNo`;
    } else if (type === 'StockTransportOrderItem') {
        entitySet = 'StockTransportOrderItems';
        query = `$filter=StockTransportOrderId eq '${binding.StockTransportOrderId}'&$expand=MaterialPlant_Nav,StockTransportOrderHeader_Nav,STOScheduleLine_Nav,STOSerialNumber_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;
    } else if (type === 'ReservationItem') {
        entitySet = 'ReservationItems';
        query = `$expand=ReservationHeader_Nav,MaterialPlant_Nav,MaterialDocItem_Nav/SerialNum&$filter=ReservationNum eq '${binding.ReservationNum}'&$orderby=ItemNum`;
    } else if (type === 'ProductionOrderItem') {
        entitySet = 'ProductionOrderItems';
        query = `$expand=Material_Nav,MaterialDocItem_Nav&$filter=OrderId eq '${binding.OrderId}'&$orderby=ItemNum`;
    } else if (type === 'ProductionOrderComponent') {
        entitySet = 'ProductionOrderComponents';
        query = `$expand=MaterialDocItem_Nav&$filter=OrderId eq '${binding.OrderId}'&$orderby=ItemNum`;
    } else if (type === 'InboundDeliveryItem') {
        entitySet = 'InboundDeliveryItems';
        query = `$filter=DeliveryNum eq '${binding.DeliveryNum}'&$expand=InboundDeliverySerial_Nav,MaterialPlant_Nav,InboundDelivery_Nav&$orderby=Item`;
    } else if (type === 'OutboundDeliveryItem') {
        entitySet = 'OutboundDeliveryItems';
        query = `$filter=DeliveryNum eq '${binding.DeliveryNum}'&$expand=OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav&$orderby=Item`;
    } else if (type === 'MaterialDocItem') {
        entitySet = 'MaterialDocItems';
        query = `$filter=MaterialDocNumber eq '${binding.MaterialDocNumber}'&$expand=SerialNum&$orderby=MatDocItem`;
    } else if (type === 'PhysicalInventoryDocItem') {
        entitySet = 'PhysicalInventoryDocItems';
        const select = '*,MaterialSLoc_Nav/StorageBin,MaterialPlant_Nav/SerialNumberProfile,Material_Nav/Description';
        const expand = 'MaterialPlant_Nav,MaterialSLoc_Nav,Material_Nav,PhysicalInventoryDocItemSerial_Nav';
        const orderBy = 'Item';
        let baseQuery = "(PhysInvDoc eq '" + binding.PhysInvDoc + "' and FiscalYear eq '" + binding.FiscalYear + "')";
        const sectionedTableFilterTerm = libCom.GetSectionedTableFilterTerm(context.getPageProxy().getControl('SectionedTable'));
        if (sectionedTableFilterTerm) {
            baseQuery = baseQuery + ' and (' + sectionedTableFilterTerm + ')';
        }
        query = '$select=' + select + '&$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=' + orderBy;
    }

    /** @type {import('../Item/ItemsData').ItemDetailsBinding} */
    const actionBinding = { ItemsQuery: { entitySet, query }, item: binding };
    context.getPageProxy().setActionBinding(actionBinding);

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Inventory/Item/ItemDetails.action',
        'Properties': {
            'PageMetadata': GetDetailsPageMetadata(context, binding),
        },
    });
}

function GetDetailsPageMetadata(context, binding) {
    const keysValues = ItemDetailsTargetKeyValues(context, binding);
    const itemDetailsPageDef = context.getPageDefinition('/SAPAssetManager/Pages/Inventory/Item/ItemDetails.page');
    const sectionedTable = itemDetailsPageDef.Controls.find(c => c._Name === 'SectionedTable');
    if (ValidationLibrary.evalIsEmpty(keysValues)) {
        sectionedTable.Sections.splice(sectionedTable.Sections.indexOf(x => x._Name === 'PhysicalInventoryDetailsSection'), 1);
    } else {
        const detailsSection = sectionedTable.Sections.find(x => x._Name === 'PhysicalInventoryDetailsSection');
        detailsSection.KeyAndValues.push(...keysValues);
    }
    return itemDetailsPageDef;
}
