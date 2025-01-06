import isAndroid from './IsAndroid';
import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';
import common from './Library/CommonLibrary';

export default function ListViewIconImages(controlProxy) {
    var iconImage = [];
    let isLocal = common.isCurrentReadLinkLocal(controlProxy.binding['@odata.readLink']);

    if (isLocal) {
        iconImage.push(isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    if (controlProxy.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
         // check if this Equipment has any docs
         const docIcon = AttachedDocumentIcon(controlProxy, controlProxy.binding.EquipDocuments);
         if (docIcon) {
            iconImage.push(docIcon);
         }
    }
    return iconImage;
}
