import libCom from '../../Common/Library/CommonLibrary';

export default function NetworkEditable(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let editable = true;
    if (data && data.network) {
        editable = false;
    }
    return editable;
}
