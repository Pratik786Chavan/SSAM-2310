import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import showSerialNumberField from '../Validation/ShowSerialNumberField';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import SpecialStockListPickerItems from './SpecialStockListPickerItems';
import { MovementTypes, SpecialStock } from '../Common/Library/InventoryLibrary';

export function GetSelectedMovementType(listpickerControlProxy) {
    const movementType = listpickerControlProxy.getValue();
    if (ValidationLibrary.evalIsEmpty(movementType) || ValidationLibrary.evalIsEmpty(movementType[0].ReturnValue)) {
        return '';
    }
    return movementType[0].ReturnValue;
}

/** @param {IListPickerFormCellProxy} context */
export default async function OnMovementTypeValueChanged(context) {
    ResetValidationOnInput(context);

    const selectedMovementType = GetSelectedMovementType(context);
    if (!selectedMovementType) {
        return Promise.resolve();
    }

    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    const [glAccountSimple, costCenterSimple, wbSElementSimple, orderSimple, networkSimple,
        activitySimple, salesOrderSimple, slesOrderItemSimple, businessAreaSimple] = [
            'GLAccountSimple', 'CostCenterSimple', 'WBSElementSimple', 'OrderSimple', 'NetworkSimple',
            'ActivitySimple', 'SalesOrderSimple', 'SalesOrderItemSimple', 'BusinessAreaSimple'].map(n => formcellContainer.getControl(n));
    const [movementReason, goodsRecepient, unloadingPoint, openQuantity, addSerialNumber, stockType] = [
        'MovementReasonPicker', 'GoodsRecipientSimple', 'UnloadingPointSimple', 'QuantitySimple', 'SerialPageNav', 'StockTypePicker'].map(n => formcellContainer.getControl(n));

    /** @type {IListPickerFormCellProxy} specialStockIndicatorPicker */
    const specialStockIndicatorPicker = formcellContainer.getControl('SpecialStockIndicatorPicker');
    specialStockIndicatorPicker.setVisible(selectedMovementType === MovementTypes.t231);
    specialStockIndicatorPicker.setPickerItems(await SpecialStockListPickerItems(context, selectedMovementType));
    setTimeout(() => specialStockIndicatorPicker.setValue(selectedMovementType === MovementTypes.t231 ? SpecialStock.OrdersOnHand : '').setEditable(selectedMovementType !== MovementTypes.t231), 500);  // set def. value after the new items are set (timeout in snowblind for setPickerItems)

    const accountAssignmentSection = [glAccountSimple, costCenterSimple, orderSimple, networkSimple, activitySimple, salesOrderSimple, slesOrderItemSimple, wbSElementSimple, businessAreaSimple];
    const objectType = common.getStateVariable(context, 'IMObjectType');
    const move = common.getStateVariable(context, 'IMMovementType');

    let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');

    let isOpenQuantity, isOpenQuantityBlocked, isOpenQtyValBlocked;
    if (context.binding) {
        isOpenQuantity = !isNaN(context.binding.OpenQuantity);
        isOpenQuantityBlocked = !isNaN(context.binding.OpenQuantityBlocked);
        isOpenQtyValBlocked = !isNaN(context.binding.OpenQtyValBlocked);
    }

    if (selectedMovementType === MovementTypes.t101) {
        if (isOpenQuantity) {
            openQuantity.setValue(Number(context.binding.OpenQuantity));
        }
        storageLocationPicker.setVisible(true);
    } else if (selectedMovementType === MovementTypes.t103 || selectedMovementType === MovementTypes.t107) {
        if (isOpenQuantity) {
            openQuantity.setValue(Number(context.binding.OpenQuantity));
        }
        storageLocationPicker.setVisible(false);
        storageLocationPicker.setValue('');
    } else if (selectedMovementType === MovementTypes.t104) {
        if (isOpenQuantityBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQuantityBlocked));
        }
        storageLocationPicker.setVisible(false);
    } else if (selectedMovementType === MovementTypes.t108) {
        if (isOpenQtyValBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQtyValBlocked));
        }
        storageLocationPicker.setVisible(false);
    } else if (selectedMovementType === MovementTypes.t105 || selectedMovementType === MovementTypes.t106) {
        if (isOpenQuantityBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQuantityBlocked));
        }
        storageLocationPicker.setVisible(true);
    } else if (selectedMovementType === MovementTypes.t109 || selectedMovementType === MovementTypes.t110) {
        if (isOpenQtyValBlocked) {
            openQuantity.setValue(Number(context.binding.OpenQtyValBlocked));
        }
        storageLocationPicker.setVisible(true);
    } else if (selectedMovementType === MovementTypes.t201) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, costCenterSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === 'RES' || objectType === 'PRD') {
            glAccountSimple.setEditable(false);
            costCenterSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            costCenterSimple.setEditable(true);
        }
    } else if (selectedMovementType === MovementTypes.t221) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, wbSElementSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === 'RES' || objectType === 'PRD') {
            glAccountSimple.setEditable(false);
            wbSElementSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            wbSElementSimple.setEditable(true);
        }
    } else if (selectedMovementType === MovementTypes.t261) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, costCenterSimple, orderSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === 'RES' || objectType === 'PRD') {
            glAccountSimple.setEditable(false);
            costCenterSimple.setEditable(false);
            orderSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            costCenterSimple.setEditable(true);
            orderSimple.setEditable(true);
        }
    } else if (selectedMovementType === MovementTypes.t281) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, activitySimple, networkSimple].includes(c)));
        movementReason.setVisible(false);
        movementReason.setValue('');
        if (objectType === 'RES' || (objectType === 'PRD' && move === 'I')) {
            glAccountSimple.setEditable(false);
            networkSimple.setEditable(false);
            activitySimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            networkSimple.setEditable(true);
            activitySimple.setEditable(true);
        }
    } else if ([MovementTypes.t301, MovementTypes.t311, MovementTypes.t321, MovementTypes.t343].includes(selectedMovementType)) {
        accountAssignmentSection.forEach(c => c.setVisible(false));
        movementReason.setVisible(false);
        movementReason.setValue('');

        if (selectedMovementType === MovementTypes.t321 || selectedMovementType === MovementTypes.t343) {
            goodsRecepient.setVisible(false);
            stockType.setVisible(false);
        } else {
            goodsRecepient.setVisible(true);
            stockType.setVisible(true);
        }

        let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
        let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
        let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');

        // let materialValue = '';
        let plantValue = '';
        let storageLocationValue = '';
        let binding = context.binding;
        if (!(common.getPreviousPageName(context) === 'StockDetailsPage')) {
            if (matrialListPicker.getValue() && matrialListPicker.getValue().length > 0) {
                // materialValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).MaterialNum;
                plantValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).Plant;
                storageLocationValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).StorageLocation;
            } else if (plant.getValue().length > 0) {
                plantValue = plant.getValue()[0].ReturnValue;
                if (storageLocationPicker.getValue().length > 0) {
                    storageLocationValue = storageLocationPicker.getValue()[0].ReturnValue;
                }
            }
        } else {
            // materialValue = binding.MaterialNum;
            plantValue = binding.Plant;
            storageLocationValue = binding.StorageLocation;
        }

        let plantToFilter = '';
        let storageLocationToFilter = '';
        let plantToEditable = true;
        let storgeLocationToEditable = false;
        let storgeLocationToResetValue = true;

        if (plantValue) {
            if (selectedMovementType === MovementTypes.t301) { //plant to plant transfer
                plantToFilter = `$filter=Plant ne '${plantValue}'&$orderby=Plant`;
                plantToEditable = true;
            } else if (selectedMovementType === MovementTypes.t311) { //within plant transfer
                plantToFilter = `$filter=Plant eq '${plantValue}'&$orderby=Plant`;
                plantToEditable = false;
                if (storageLocationValue) {
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    storgeLocationToEditable = true;
                }
            } else if (selectedMovementType === MovementTypes.t321 || selectedMovementType === MovementTypes.t343) { //within plant transfer
                plantToFilter = `$filter=Plant eq '${plantValue}'&$orderby=Plant`;
                plantToEditable = false;
                if (storageLocationValue) {
                    storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation eq '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    storgeLocationToEditable = false;
                }
            }
        } else if (selectedMovementType === MovementTypes.t321 || selectedMovementType === MovementTypes.t343) {
            plantToEditable = false;
        }

        let plantToSpecifier = planToListPicker.getTargetSpecifier();
        plantToSpecifier.setQueryOptions(plantToFilter);
        plantToSpecifier.setEntitySet('Plants');
        plantToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        planToListPicker.setEditable(plantToEditable);
        planToListPicker.setTargetSpecifier(plantToSpecifier);
        planToListPicker.redraw();

        let setSloc = () => {
            let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
            storageLocationToSpecifier.setQueryOptions(storageLocationToFilter);
            storageLocationToSpecifier.setEntitySet('StorageLocations');
            storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            storageLocationToListPicker.setEditable(storgeLocationToEditable);
            if (storgeLocationToResetValue) {
                storageLocationToListPicker.setValue('');
            }
            storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
            storageLocationToListPicker.redraw();
        };

        if (selectedMovementType === MovementTypes.t301 || selectedMovementType === MovementTypes.t311) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], plantToFilter).then(data => {
                if (data.length === 1) {
                    let plantInfo = data.getItem(0);
                    storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}'&$orderby=StorageLocation`;
                    if (selectedMovementType === '311' && storageLocationValue) {
                        storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    }
                    storgeLocationToEditable = true;
                    if (binding && binding.MoveStorageLocation) {
                        if (plantInfo.Plant === binding.MovePlant) {
                            storgeLocationToResetValue = false;
                        }
                    }
                }
                setSloc();
            });
        } else {
            setSloc();
        }
    } else if (selectedMovementType === MovementTypes.t551) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, costCenterSimple].includes(c)));
        movementReason.setVisible(true);
        if (context.binding && !context.binding.MovementReason) {
            movementReason.setValue('');
        }
        if (objectType === 'RES' || objectType === 'PRD') {
            glAccountSimple.setEditable(false);
            costCenterSimple.setEditable(false);
        } else {
            glAccountSimple.setEditable(true);
            costCenterSimple.setEditable(true);
        }

        let movementReasonSpecifier = movementReason.getTargetSpecifier();
        movementReasonSpecifier.setQueryOptions("$filter=MovementType eq '551'&$orderby=MovementReason");
        movementReasonSpecifier.setEntitySet('MovementReasons');
        movementReasonSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        movementReason.setTargetSpecifier(movementReasonSpecifier);
        movementReason.redraw();
    } else if (selectedMovementType === MovementTypes.t122) {
        accountAssignmentSection.forEach(c => c.setVisible(false));
        movementReason.setVisible(true);
        goodsRecepient.setEditable(true);
        unloadingPoint.setEditable(true);
        if (context.binding && !context.binding.MovementReason) {
            movementReason.setValue('');
        }

        let movementReasonSpecifier = movementReason.getTargetSpecifier();
        movementReasonSpecifier.setQueryOptions("$filter=MovementType eq '122'&$orderby=MovementReason");
        movementReasonSpecifier.setEntitySet('MovementReasons');
        movementReasonSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        movementReason.setTargetSpecifier(movementReasonSpecifier);
        movementReason.redraw();
        return showSerialNumberField(context).then((result) => {
            openQuantity.setEditable(!result);
            addSerialNumber.setVisible(result);
        });
    } else if (selectedMovementType === MovementTypes.t102) {
        accountAssignmentSection.forEach(c => c.setVisible(false));
        movementReason.setVisible(false);
        goodsRecepient.setEditable(false);
        unloadingPoint.setEditable(false);
        openQuantity.setEditable(false);
        addSerialNumber.setVisible(false);
        if (context.binding && !context.binding.MovementReason) {
            movementReason.setValue('');
        }
        if (context.binding && context.binding.SerialNum && context.binding.SerialNum.length) {
            setDefaultSerials(context, context.binding.SerialNum);
        }
    } else if (selectedMovementType === MovementTypes.t231) {
        accountAssignmentSection.forEach(c => c.setVisible([glAccountSimple, salesOrderSimple, slesOrderItemSimple].includes(c)));
    }
}

function setDefaultSerials(context, serials) {
    let arr = serials.map(item => {
        return {
            SerialNumber: item.SerialNumber || item.SerialNum,
            selected: !!context.binding.SerialNum || !!context.binding.PickedQuantity,
            downloaded: !context.binding.SerialNum,
        };
    });
    common.setStateVariable(context, 'SerialNumbers', { actual: arr, initial: JSON.parse(JSON.stringify(arr)) });
}
