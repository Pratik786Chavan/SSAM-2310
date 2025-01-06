import libCom from '../../Common/Library/CommonLibrary';

export default function OrderEditable(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let editable = true;
    if (data && data.order) {
        editable = false;
    }
    return editable;
}
