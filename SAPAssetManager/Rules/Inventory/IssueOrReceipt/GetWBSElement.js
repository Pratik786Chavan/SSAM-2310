import libCom from '../../Common/Library/CommonLibrary';

export default function GetWBSElement(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.WBSElement;
        } else if (type === 'ReservationItem') {
            return context.binding.WBSElement;
        }
    }
    if (data && data.project) return data.project;
    return '';
}
