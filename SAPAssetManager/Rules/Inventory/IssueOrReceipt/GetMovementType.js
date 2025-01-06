import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function GetMovementType(context) {
    let type;
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PurchaseOrderItem') {
            return MovementTypes.t101;
        }
    }
    return '';
}
