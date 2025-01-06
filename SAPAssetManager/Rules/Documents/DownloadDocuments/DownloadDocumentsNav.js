import libDoc from '../DocumentLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function DownloadDocumentsNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}`, [], libDoc.getExpandQueryForDownloadDocumentsNav(context, context.binding['@odata.type']))
        .then(result => {
            const item = result.getItem(0);

            return libDoc.getDocumentsListForDownload(context, item)
                .then(documents => {
                    if (libVal.evalIsEmpty(documents)) {
                        return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentsNoDocumentsMessage.action');
                    }
                    
                    //store documents list in client data to use it on download documents page to avoid read documents list again
                    context.getPageProxy().getClientData().documentsList = documents;

                    context.setActionBinding(item);

                    return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentsNav.action');
                });
        });
}
