import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import isAndroid from '../Common/IsAndroid';
import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';

export default function OperationsListViewIconImages(pageProxy) {
    var iconImage = [];
    if (libCommon.getTargetPathValue(pageProxy, '#Property:@sap.isLocal') || libCommon.getTargetPathValue(pageProxy, '#Property:OperationMobileStatus_Nav/#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(pageProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    if (!iconImage.length && pageProxy.binding && pageProxy.binding.OperationLongText && pageProxy.binding.OperationLongText.length) {
        pageProxy.binding.OperationLongText.map(item => {
            if (item['@sap.isLocal']) {
                iconImage.push(isAndroid(pageProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
            }
        });
    }

    if (!iconImage.length && pageProxy.binding && pageProxy.binding.Tools && pageProxy.binding.Tools.length) {
        pageProxy.binding.Tools.map(item => {
            if (item['@sap.isLocal']) {
                iconImage.push(isAndroid(pageProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
            }
        });
    }

    if (!iconImage.length && pageProxy.binding && pageProxy.binding.Components && pageProxy.binding.Components.length) {
        pageProxy.binding.Components.map(item => {
            if (item['@sap.isLocal']) {
                iconImage.push(isAndroid(pageProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
            }
        });
    }

    let binding = pageProxy.getBindingObject();
    
    // check if Operations has any attached documents
    const docIcon = AttachedDocumentIcon(pageProxy, binding.WOOprDocuments_Nav);
    if (docIcon) {
        iconImage.push(docIcon);
    }

    if (binding && binding.OperationNo && libMobile.isOperationStatusChangeable()) { //check mobile status only if operation level assignment
        return libMobile.mobileStatus(pageProxy, binding).then(function(result) {
            if (result === 'COMPLETED') {
                iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
            }
            return iconImage;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), err);
        });
    } else { //check system status
        return libMobile.isMobileStatusConfirmed(pageProxy).then(function(result) {
            if (result) {
                iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
            }
            return iconImage;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), err);
        });
    }

}
