import IsOnCreate from '../Common/IsOnCreate';
import CommonLibrary from '../Common/Library/CommonLibrary';
import ServiceContractItemQuery from './CreateUpdate/ServiceContractItemQuery';
import ServiceContractQuery from './CreateUpdate/ServiceContractQuery';

/**
* Update service contract list (or service contract item) picker options based on selected values
* @param {IClientAPI} control
*/
export default function UpdateContractItemsComponent(control, serviceOrder, srContract, type = 'item') {
    // setting service contract field as enabled if service order is selected
    if (IsOnCreate(control)) {
        const serviceOrderId = serviceOrder || CommonLibrary.getControlValue(CommonLibrary.getControlProxy(control.getPageProxy(), 'ServiceOrderLstPkr'));
        const srContractId = srContract || CommonLibrary.getControlValue(CommonLibrary.getControlProxy(control.getPageProxy(), 'ServiceContractLstPkr'));
        switch (type) {
            case 'contract':
                return ServiceContractQuery(control, serviceOrderId).then(query => {
                    const entity = 'S4ServiceContracts';
                    const controlName = 'ServiceContractLstPkr';
                    return _updateListPickerParams(control, controlName, entity, query, CommonLibrary.isDefined(serviceOrderId));
                });
            case 'item':
            default:
                return ServiceContractItemQuery(control, serviceOrderId, srContractId).then(query => {
                    const entity = 'S4ServiceContractItems';
                    const controlName = 'ServiceContractItemLstPkr';
                    return _updateListPickerParams(
                        control,
                        controlName,
                        entity,
                        query,
                        CommonLibrary.isDefined(serviceOrderId) && CommonLibrary.isDefined(srContractId),
                    );
                });
        }
        
    }
    return Promise.resolve();
}

function _updateListPickerParams(context, controlName, entitySet, query, setEditable = false) {
    const controlListPicker = context.getPageProxy().getControl('FormCellContainer').getControl(controlName);
    const controlListPickerSpecifier = controlListPicker.getTargetSpecifier();
    controlListPickerSpecifier.setEntitySet(entitySet);
    controlListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    controlListPickerSpecifier.setQueryOptions(query);
    controlListPicker.setTargetSpecifier(controlListPickerSpecifier);
    controlListPicker.setValue('');
    controlListPicker.setEditable(setEditable);
    controlListPicker.redraw();
}
