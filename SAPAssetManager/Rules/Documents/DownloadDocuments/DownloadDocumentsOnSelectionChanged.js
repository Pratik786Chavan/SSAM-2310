import DownloadDocumentsPageCaption from './DownloadDocumentsPageCaption';
import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsOnSelectionChanged(context) {
    const { pageProxyClientData, selectableSection, pageProxy } = libDoc.getDownloadDocumentsDataFromContext(context);

    const lastChanged = selectableSection.getSelectionChangedItem();
    const lastChangedDocumentID = lastChanged.binding.DocumentID;

    if (lastChanged.selected) {
        pageProxyClientData.selectedDocuments[lastChangedDocumentID] = lastChanged.binding;
    } else {
        delete pageProxyClientData.selectedDocuments[lastChangedDocumentID];
    }

    pageProxy.setCaption(DownloadDocumentsPageCaption(context));
    selectableSection.redraw(true);
}
