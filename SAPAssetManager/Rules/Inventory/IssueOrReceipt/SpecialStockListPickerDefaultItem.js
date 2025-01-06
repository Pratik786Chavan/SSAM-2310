import { MovementTypes, SpecialStock } from '../Common/Library/InventoryLibrary';
import { GetSelectedMovementType } from './OnMovementTypeValueChanged';

/**
 * @param {IListPickerFormCellProxy} context
*/
export default function SpecialStockListPickerDefaultItem(context) {
    const selectedMovementType = getSelectedMovementType(context);
    return selectedMovementType === MovementTypes.t231 ? SpecialStock.OrdersOnHand : '';
}

function getSelectedMovementType(context) {
    const fcContainer = context.getPageProxy().getControl('FormCellContainer');
    return fcContainer && fcContainer.getControl('MovementTypePicker') && GetSelectedMovementType(fcContainer.getControl('MovementTypePicker'));
}
