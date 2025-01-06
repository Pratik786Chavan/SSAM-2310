import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';

/** @param {{binding: MaterialDocItem | PurchaseOrderItem | ReservationItem | ProductionOrderItem | InboundDeliveryItem | OutboundDeliveryItem | ProductionOrderComponent | StockTransportOrderItem} | IClientAPI} context */
export default function MovementTypeQueryOptions(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);

    const movementTypeVar = libCom.getStateVariable(context, 'CurrentDocsItemsMovementType');
    const movementType = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    //Find the POItem record we are working with
    if (type === 'MaterialDocItem') {
        if (movementType === 'REV') {
            return GetMovementTypeFilter(`${(Number(context.binding.MovementType) + 1)}`);
        } else if (movementType === 'RET') {
            return GetMovementTypeFilter([MovementTypes.t122, MovementTypes.t102]);
        }
        return GetMovementTypeFilter(context.binding.MovementType);
    } else if (type === 'PurchaseOrderItem' && movementType === 'R') {
        let moveTypes = [MovementTypes.t101, MovementTypes.t103, MovementTypes.t107];
        if (context.binding.OpenQuantityBlocked !== 0) {
            moveTypes.push(MovementTypes.t105);
        }
        if (context.binding.OpenQtyValBlocked !== 0) {
            moveTypes.push(MovementTypes.t109);
        }
        moveTypes.sort();
        return GetMovementTypeFilter(moveTypes);
    } else if (type === 'ProductionOrderItem' || (type === 'StockTransportOrderItem' && movementType !== 'I')) { //Receipt
        return GetMovementTypeFilter(MovementTypes.t101);
    } else if (['ReservationItem', 'InboundDeliveryItem', 'OutboundDeliveryItem', 'ProductionOrderComponent'].includes(type)) { //Issue, pull from the item itself
        return GetMovementTypeFilter(context.binding.MovementType);
    } else if (type === 'StockTransportOrderItem' && movementType === 'I') { //Issue
        return GetMovementTypeFilter(MovementTypes.t351);
    }
    if (movementTypeVar) {
        return GetMovementTypeFilter(movementTypeVar);
    }
    if (movementType === 'I' && objectType === 'TRF' || movementType === 'T') {
        return GetMovementTypeFilter([MovementTypes.t301, MovementTypes.t311, MovementTypes.t321, MovementTypes.t343]);
    } else if (movementType === 'I') {
        return GetMovementTypeFilter([MovementTypes.t201, MovementTypes.t221, MovementTypes.t261, MovementTypes.t281, MovementTypes.t551, MovementTypes.t231]);
    } else if (movementType === 'R') {
        return GetMovementTypeFilter('501');
    }

    return "$orderby=MovementType,MovementTypeDesc&$filter=SpecialStockInd eq '' and ReceiptInd eq '' and Consumption eq ''";
}

/** @param {string[] | string} types */
function GetMovementTypeFilterTerm(types) {
    return `${(types instanceof Array ? types : [types]).map(t => `MovementType eq '${t}'`).join(' or ')}`;
}

/** @param {string[] | string} types */
function GetMovementTypeFilter(types) {
    return `$orderby=MovementType,MovementTypeDesc&$filter=${GetMovementTypeFilterTerm(types)}`;
}
