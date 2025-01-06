import libCom from '../../Common/Library/CommonLibrary';

export default function CostCenterEditable(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let editable = true;
    if (data && data.cost_center) {
        editable = false;
    }
    return editable;
}
