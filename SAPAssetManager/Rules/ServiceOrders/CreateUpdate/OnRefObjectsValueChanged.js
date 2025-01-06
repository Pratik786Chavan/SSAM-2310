import IsIOS from '../../Common/IsIOS';

export default function OnRefObjectsValueChanged(clientAPI) {  
    const isIOS = IsIOS(clientAPI);
    const pageProxy = clientAPI.getPageProxy();
    const formCellContainer = pageProxy.getControl('FormCellContainer');
    const productIdListPickerControl = formCellContainer.getControl('ProductLstPkr');
    const productIdListPickerValue = formCellContainer.getControl('ProductLstPkr').getValue();
    const equipmentHierarchyListPickerControl = isIOS ?
        formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension :
        formCellContainer.getControl('EquipHierarchyExtensionControl')._control;
    const equipmentHierarchyListPickerValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
    const funcLocHierarchyListPickerControl = isIOS ?
        formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension :
        formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control;
    const funcLocHierarchyListPickerValue = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();

    if (productIdListPickerValue.length) {
        funcLocHierarchyListPickerControl.setEditable(false);
        funcLocHierarchyListPickerControl.setValue(null);
        equipmentHierarchyListPickerControl.setEditable(false);
        equipmentHierarchyListPickerControl.setValue(null);
    } else if (equipmentHierarchyListPickerValue) {
        productIdListPickerControl.setEditable(false);
        productIdListPickerControl.setValue(null);
        funcLocHierarchyListPickerControl.setEditable(false);
        funcLocHierarchyListPickerControl.setValue(null);
    } else if (funcLocHierarchyListPickerValue) {
        productIdListPickerControl.setEditable(false);
        productIdListPickerControl.setValue(null);
        equipmentHierarchyListPickerControl.setEditable(false);
        equipmentHierarchyListPickerControl.setValue(null);
    } else {
        productIdListPickerControl.setEditable(true);
        funcLocHierarchyListPickerControl.setEditable(true);
        equipmentHierarchyListPickerControl.setEditable(true);
    }
}
