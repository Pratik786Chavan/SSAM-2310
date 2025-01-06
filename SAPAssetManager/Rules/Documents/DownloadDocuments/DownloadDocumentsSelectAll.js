import DownloadDocumentsPageCaption from './DownloadDocumentsPageCaption';
import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsSelectAll(context) {
    const { pageProxyClientData, selectableSection, pageProxy, documentsList } = libDoc.getDownloadDocumentsDataFromContext(context);

    const selectedDocuments = {};
    documentsList.forEach(doc => {
        selectedDocuments[doc.DocumentID] = doc;
    });
    pageProxyClientData.selectedDocuments = selectedDocuments;
    pageProxy.setCaption(DownloadDocumentsPageCaption(context));
    selectableSection.redraw(true);
}
