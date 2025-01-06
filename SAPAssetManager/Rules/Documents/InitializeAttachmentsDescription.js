import DocumentLibrary from './DocumentLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function InitializeAttachmentsDescription(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return '';
    }

    let objectDetails = DocumentLibrary.getDocumentObjectDetail(context);
    if (objectDetails && objectDetails.length) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', objectDetails[0].entitySet, [], objectDetails[0].queryOption).then(attachments => {
            if (!attachments.length) return '';
    
            let document = attachments.find(attachment => attachment['@sap.isLocal']);
            let documentObject = document ? document.Document : null;
            if (documentObject) {
               return documentObject.Description;
            }

            return '';
        });
    }
}
