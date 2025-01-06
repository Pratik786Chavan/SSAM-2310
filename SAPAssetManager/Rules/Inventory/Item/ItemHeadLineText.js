import GetMaterialName from '../../Common/GetMaterialName';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemHeadLineText(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    const type = item['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    if (type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem') {
        return item.ItemText;
    } else if (type === 'MaterialDocItem') {
        return item.MaterialDocNumber;
    } else if (type === physicType) {
        return item.Material + ' - ' + item.Material_Nav.Description;
    } else {
        return GetMaterialName(context, item);
    }
}
