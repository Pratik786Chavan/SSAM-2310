import libCom from '../../Common/Library/CommonLibrary';

export default function WBSElementEditable(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let editable = true;
    if (data && data.project) {
        editable = false;
    }
    return editable;
}
