import DownloadDocumentsPageCaption from './DownloadDocumentsPageCaption';
import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsDeselectAll(context) {
    const { pageProxyClientData, selectableSection, pageProxy } = libDoc.getDownloadDocumentsDataFromContext(context);

    pageProxyClientData.selectedDocuments = {};
    pageProxy.setCaption(DownloadDocumentsPageCaption(context));
    selectableSection.redraw(true);
}
