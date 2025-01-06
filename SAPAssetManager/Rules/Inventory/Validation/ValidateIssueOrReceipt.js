import libCom from '../../Common/Library/CommonLibrary';
import showBatch from './ShowMaterialBatchField';
// import showAuto from './ShowAutoSerialNumberField';
import ShowSerialNumberField from './ShowSerialNumberField';
import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import showMaterialNumberListPicker from './ShowMaterialNumberListPicker';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';
import ValidationLibrary, { CustomDirective, RequiredDirective } from '../../Common/Library/ValidationLibrary';
import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function ValidateIssueOrReceipt(context) {
    const fcContainer = context.getControl('FormCellContainer');
    const [QuantitySimple, MatrialListPicker, MovementReasonPicker, StorageLocationPicker, MovementTypePicker,
        BatchSimple, ConfirmedQuantitySimple, AutoSerialNumberSwitch, PlantToListPicker, StorageLocationToListPicker,
        BatchNumTo, CostCenterSimple, WBSElementSimple, SalesOrderSimple, SalesOrderItemSimple,
        OrderSimple, NetworkSimple, ActivitySimple, NumOfLabels] = [
            'QuantitySimple', 'MatrialListPicker', 'MovementReasonPicker', 'StorageLocationPicker', 'MovementTypePicker',
            'BatchSimple', 'ConfirmedQuantitySimple', 'AutoSerialNumberSwitch', 'PlantToListPicker', 'StorageLocationToListPicker',
            'BatchNumTo', 'CostCenterSimple', 'WBSElementSimple', 'SalesOrderSimple', 'SalesOrderItemSimple',
            'OrderSimple', 'NetworkSimple', 'ActivitySimple', 'NumOfLabels'].map(n => fcContainer.getControl(n));
    [QuantitySimple, MatrialListPicker, MovementReasonPicker, StorageLocationPicker, MovementTypePicker,
        MovementReasonPicker, BatchSimple, ConfirmedQuantitySimple, AutoSerialNumberSwitch, NumOfLabels].forEach(c => c.clearValidation());

    const movementType = libCom.getListPickerValue(MovementTypePicker.getValue());
    const target = Math.max(0, Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue()));
    /* eslint-disable no-unused-vars */
    const validations = [
        RequiredDirective(MovementReasonPicker, ((control) => [MovementTypes.t551, MovementTypes.t122].includes(movementType))), // Movement reason cannot be blank of movement type is 122, 551
        RequiredDirective(MatrialListPicker, ((control) => ((!(libCom.getPreviousPageName(control.getPageProxy()) === 'StockDetailsPage')) && showMaterialTransferToFields(control.getPageProxy())) || showMaterialNumberListPicker(control.getPageProxy()))),
        RequiredDirective(PlantToListPicker, ((control) => showMaterialTransferToFields(control.getPageProxy()))),
        RequiredDirective(StorageLocationToListPicker, ((control) => showMaterialTransferToFields(control.getPageProxy()))),
        RequiredDirective(StorageLocationPicker, ((control) => MovementTypes.t103 !== movementType && MovementTypes.t104 !== movementType && MovementTypes.t107 !== movementType && MovementTypes.t108 !== movementType)),
        RequiredDirective(MovementTypePicker),
        RequiredDirective(BatchSimple, ((control) => showBatch(control.getPageProxy(), true))), // Check that batch is provided when material is batch enabled
        RequiredDirective(BatchNumTo, ((control) => Promise.all([showBatch(control.getPageProxy(), true), showMaterialTransferToFields(control.getPageProxy())]).then(results => results.every(i => !!i)))),
        RequiredDirective(CostCenterSimple, ((control) => [MovementTypes.t551, MovementTypes.t201].includes(movementType) && control.getEditable())),
        RequiredDirective(WBSElementSimple, ((control) => MovementTypes.t221 === movementType && control.getEditable())),
        RequiredDirective(SalesOrderSimple, ((control) => MovementTypes.t231 === movementType)),
        RequiredDirective(SalesOrderItemSimple, ((control) => MovementTypes.t231 === movementType)),
        RequiredDirective(OrderSimple, ((control) => MovementTypes.t261 === movementType && control.getEditable())),
        RequiredDirective(NetworkSimple, ((control) => MovementTypes.t281 === movementType && control.getEditable())),
        RequiredDirective(ActivitySimple, ((control) => MovementTypes.t281 === movementType && control.getEditable())),
        CustomDirective(QuantitySimple, //Did user provide allowed decimal precision for quantity?
            (control) => libMeasure.evalPrecision(libLocal.toNumber(control, control.getValue())) <= target, (control) => true,
            (control) => target > 0 ? context.localizeText('quantity_decimal_precision_of', [target]) : context.localizeText('quantity_integer_without_decimal_precision')),
    ];
    /* eslint-enable no-unused-vars */
    validations.push(validateQuantityGreaterThanZero(context, QuantitySimple, AutoSerialNumberSwitch, ConfirmedQuantitySimple));
    validations.push(validateQuantityIsValid(context, QuantitySimple, movementType));

    validations.push(validateNumberOfLabels(NumOfLabels));

    return Promise.all(validations).then(results => results.every(i => i));
}

/**
 * Quantity must be > 0
 */
function validateQuantityGreaterThanZero(context, QuantitySimple, AutoSerialNumberSwitch, ConfirmedQuantitySimple) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const error = { message: 'quantity_must_be_greater_than_zero', field: QuantitySimple };

    return ShowSerialNumberField(context).then(show => {
        if (objectType === 'ADHOC' || objectType === 'TRF') {
            if (libLocal.toNumber(context, QuantitySimple.getValue())) {
                return true;
            }
        } else {
            if (!show) {
                if (libLocal.toNumber(context, QuantitySimple.getValue())) {
                    return true;
                }
            } else {
                if (AutoSerialNumberSwitch.getValue()) {
                    if (libLocal.toNumber(context, QuantitySimple.getValue())) {
                        return true;
                    }
                } else {
                    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;
                    const serialNumbers = actualNumbers && actualNumbers.filter(item => item.selected).length;

                    if (type === 'MaterialDocItem') {
                        if (serialNumbers !== 0) {
                            return true;
                        }
                    } else {
                        if (serialNumbers) {
                            return true;
                        }
                    }

                    error.message = 'confirmed_quantity_change';
                    error.field = ConfirmedQuantitySimple;
                }
            }
        }

        const message = context.localizeText(error.message);
        libCom.executeInlineControlError(context, error.field, message);
        return false;
    });
}


/**
 *
 * Quantity cannot be greater than open
 */
function validateQuantityIsValid(context, QuantitySimple, movementType) {
    let qty = libLocal.toNumber(context, QuantitySimple.getValue());
    let open;
    let openRequired = false;
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let openQuantityBlocked, openQtyValBlocked, openQuantity;

    if (context.binding) {
        let binding = context.binding;
        if (type === 'PO') {

            switch (movementType) {
                case MovementTypes.t101:
                // eslint-disable-next-line no-fallthrough
                case MovementTypes.t103:
                // eslint-disable-next-line no-fallthrough
                case MovementTypes.t107: {
                    if (binding.OpenQuantity !== undefined) {
                        openQuantity = binding.OpenQuantity;
                    } else if (binding.PurchaseOrderItem_Nav !== undefined) {
                        openQuantity = binding.PurchaseOrderItem_Nav.OpenQuantity;
                    }
                    open = Number(openQuantity) + Number(binding.TempLine_OldQuantity);
                    openRequired = true;
                    break;
                }
                case MovementTypes.t105:
                    if (binding.OpenQuantityBlocked !== undefined) {
                        openQuantityBlocked = binding.OpenQuantityBlocked;
                    } else if (binding.PurchaseOrderItem_Nav !== undefined) {
                        openQuantityBlocked = binding.PurchaseOrderItem_Nav.OpenQuantityBlocked;
                    }
                    open = Number(openQuantityBlocked) + Number(binding.TempLine_OldQuantity);
                    openRequired = true;
                    break;
                case MovementTypes.t109: {
                    if (binding.OpenQtyValBlocked !== undefined) {
                        openQtyValBlocked = binding.OpenQtyValBlocked;
                    } else if (binding.PurchaseOrderItem_Nav !== undefined) {
                        openQtyValBlocked = binding.PurchaseOrderItem_Nav.OpenQtyValBlocked;
                    }
                    open = Number(openQtyValBlocked) + Number(binding.TempLine_OldQuantity);
                    openRequired = true;
                    break;
                }
                default: {
                    // ignore quantity check, openRequired remains false
                    break;
                }
            }
        } else if (type === 'PRD' && move === 'R') {
            open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
            openRequired = true;
        } else if (type === 'STO') {
            if (move === 'R') { //Receipt
                open = Number(binding.TempItem_IssuedQuantity) - Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_OldQuantity);
            } else { //Issue
                open = Number(binding.TempItem_OrderQuantity) - Number(binding.TempItem_IssuedQuantity) + Number(binding.TempLine_OldQuantity);
            }
            openRequired = true;
        } else if (type === 'RES' || (type === 'PRD' && move === 'I')) {
            open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
            openRequired = true;
        } else if (type === 'REV') {
            open = Number(binding.TempLine_OldQuantity);
            openRequired = true;
        }
    }
    // TODO: adjust calculation and quantity for the case of movement changes
    if (qty <= open || !openRequired) {
        return true;
    }

    let message = context.localizeText('po_item_receiving_quantity_failed_validation_message', [open]);
    libCom.executeInlineControlError(context, QuantitySimple, message);
    return false;
}

/** @param {IControlProxy} control */
export function validateNumberOfLabels(control) {
    if (control.getVisible() && !ValidationLibrary.evalIsEmpty(control.getValue())) {
        const value = control.getValue();
        const num = libLocal.toNumber(control, value);
        const limit = control.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/NumberOfLabelsFieldLength.global').getValue();
        let validationMsg = '';
        if (value.length > limit) {
            validationMsg = control.localizeText('validation_maximum_field_length', [limit]);
        } else if (libMeasure.evalPrecision(num) > 0) {
            validationMsg = control.localizeText('forms_numeric_integer');
        } else if (Number.isNaN(num) || num < 0) {
            validationMsg = control.localizeText('validation_value_greater_than_or_equal_to_zero');
        }
        if (validationMsg) {
            libCom.executeInlineControlError(control, control, validationMsg);
            return false;
        }
    }
    return true;
}
