import libCom from '../../Common/Library/CommonLibrary';

export default function GetNumberOfLabels(context) {
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if ((type === 'MaterialDocItem') && (objectType === 'REV')) {
        //replacing 000 by removing leading zeroes
        return context.binding.NumOfLabels.replace(/^0+/, '');
    }

    return '';
}
