import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CalculateNewBlockedQuantity(context) {
    const tempItem = libCom.getStateVariable(context, 'TempItem');
    let binding;
    if (context.binding.TempItem_OpenQuantity !== undefined) {
        binding = context.binding;
    } else {
        binding = tempItem;
    }
    let openQuantityBlocked;
    if (binding.OpenQuantityBlocked !== undefined) {
        openQuantityBlocked = binding.OpenQuantityBlocked;
    } else if (binding.PurchaseOrderItem_Nav !== undefined) {
        openQuantityBlocked = binding.PurchaseOrderItem_Nav.OpenQuantityBlocked;
    }
    if (binding.TempLine_MovementType === MovementTypes.t103) {
        return Number(openQuantityBlocked) + Number(binding.TempLine_EntryQuantity) - Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t104) {
        return Number(openQuantityBlocked) - Number(binding.TempLine_EntryQuantity) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t105) {
        return Number(openQuantityBlocked) - Number(binding.TempLine_EntryQuantity) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t106) {
        return Number(openQuantityBlocked) + Number(binding.TempLine_EntryQuantity) - Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t124) {
        return Number(openQuantityBlocked) - Number(binding.TempLine_EntryQuantity) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t126) {
        return Number(openQuantityBlocked) + Number(binding.TempLine_EntryQuantity) - Number(binding.TempLine_OldQuantity);
    } else {
        return Number(openQuantityBlocked);
    }
}
