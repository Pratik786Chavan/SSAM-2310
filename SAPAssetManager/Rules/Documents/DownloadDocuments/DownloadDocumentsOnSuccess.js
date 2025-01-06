import DocumentSave from '../Save/DocumentSave';
import Logger from '../../Log/Logger';
import DownloadDocumentsTotalSize from './DownloadDocumentsTotalSize';

export default async function DownloadDocumentsOnSuccess(context) {
    const errors = [];

    const clientData = context.getClientData();
    const selectedDocumentsList = clientData.selectedDocumentsList;
    const totalSize = DownloadDocumentsTotalSize(context, selectedDocumentsList, true);
    const totalLength = selectedDocumentsList.length;

    delete clientData.selectedDocumentsList;

    for (let i = 0; i < selectedDocumentsList.length; i++) {
        const doc = selectedDocumentsList[i];
        const readLink = doc['@odata.readLink'];

        context.updateProgressBanner(context.localizeText('download_documents_downloading_x_of_x_documents', [i + 1, totalLength, totalSize]));

        // Download action for document
        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action',
            'Properties': {
                'DefiningRequests': [
                    {
                        'Name': doc['@odata.id'].replace(/[()=',]/g, ''),
                        'Query': readLink,
                        'AutomaticallyRetrievesStreams': true,
                    },
                ],
                'OnSuccess': '',
                'OnFailure': '',
            },
        }).then(async () => {
            // DownloadMedia action for document
            await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Documents/DownloadMedia.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'Documents',
                        'ReadLink': readLink,
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                    },
                    'OnSuccess': '',
                    'OnFailure': '',
                },
            }).then(() => {
                DocumentSave(context, doc);
            }).catch((error) => {
                Logger.error(`DownloadMedia ${readLink} action failed: ${error}`);
                errors.push({
                    errorText: error.replace(/\[(.*)\]\s*/g, ''),
                    Document: doc,
                });
            });
        }).catch((error) => {
            Logger.error(`Download ${readLink} action failed: ${error}`);
            errors.push({
                errorText: error.replace(/\[(.*)\]\s*/g, ''),
                Document: doc,
            });
        });
    }

    if (errors.length) {
        clientData.downloadDocumentsErrors = errors;

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Documents/DownloadDocumentsFailedToDownload.action',
            'Properties': {
                'Message': context.localizeText('x_documents_failed_to_download', [errors.length]),
            },
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentsSuccess.action');
}
