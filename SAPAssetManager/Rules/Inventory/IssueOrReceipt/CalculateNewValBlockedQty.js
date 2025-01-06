import libCom from '../../Common/Library/CommonLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CalculateNewValBlockedQty(context) {
    const tempItem = libCom.getStateVariable(context, 'TempItem');
    let binding;
    if (context.binding.TempItem_OpenQuantity !== undefined) {
        binding = context.binding;
    } else {
        binding = tempItem;
    }
    let openQtyValBlocked;
    if (binding.OpenQtyValBlocked !== undefined) {
        openQtyValBlocked = binding.OpenQtyValBlocked;
    } else if (binding.PurchaseOrderItem_Nav !== undefined) {
        openQtyValBlocked = binding.PurchaseOrderItem_Nav.OpenQtyValBlocked;
    }
    if (binding.TempLine_MovementType === MovementTypes.t107) {
        return Number(openQtyValBlocked) + Number(binding.TempLine_EntryQuantity) - Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t108) {
        return Number(openQtyValBlocked) - Number(binding.TempLine_EntryQuantity) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t109) {
        return Number(openQtyValBlocked) - Number(binding.TempLine_EntryQuantity) + Number(binding.TempLine_OldQuantity);
    } else if (binding.TempLine_MovementType === MovementTypes.t110) {
        return Number(openQtyValBlocked) + Number(binding.TempLine_EntryQuantity) - Number(binding.TempLine_OldQuantity);
    } else {
        return Number(openQtyValBlocked);
    }
}
