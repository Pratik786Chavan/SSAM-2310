import libDoc from '../DocumentLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

export default function DownloadDocumentsTarget(context) {
    const { pageProxyClientData, documentsList, pageProxy } = libDoc.getDownloadDocumentsDataFromContext(context);

    if (!libVal.evalIsEmpty(documentsList)) {
        return documentsList;
    }

    // read stored documents list from previous page
    try {
        const docsFromPrevPage = context.evaluateTargetPath('#Page:-Previous/#ClientData').documentsList;
        if (!libVal.evalIsEmpty(docsFromPrevPage)) {
            pageProxyClientData.documentsList = docsFromPrevPage;

            delete context.evaluateTargetPath('#Page:-Previous/#ClientData').documentsList;
            
            return docsFromPrevPage;
        }
    } catch (error) {
        Logger.error('Cannot read documents list from previous page',  error);
    }

    return libDoc.getDocumentsListForDownload(context, pageProxy.binding).then(documents => {
        pageProxyClientData.documentsList = documents;
        return documents;
    });
}
