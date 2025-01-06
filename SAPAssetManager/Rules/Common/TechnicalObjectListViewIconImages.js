import IsAndroid from './IsAndroid';
import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';

export default function TechnicalObjectListViewIconImages(context) {
    const binding = context.binding;
    const isEquipment = binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
    const docs = binding[isEquipment ? 'EquipDocuments' : 'FuncLocDocuments'] || [];
    const iconImage = [];

    if (binding['@sap.isLocal'] || docs.some(doc => doc['@sap.isLocal'])) {
        iconImage.push(IsAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    // check if this FLOC has any docs
    const docIcon = AttachedDocumentIcon(context, docs);
    if (docIcon) {
        iconImage.push(docIcon);
    }

    return iconImage;
}
