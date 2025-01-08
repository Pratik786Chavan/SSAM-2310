import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';


//Get the Maintanance Activity Type Picker value
export default function ZWorkOrderCreateUpdateMaintActivityTypeValue(pageProxy) {
    let maintActivityType = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:MaintActivityTypeLstPkr/#Value');
    return libCommon.getListPickerValue(maintActivityType);
}
