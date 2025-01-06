import libDoc from '../DocumentLibrary';


export default function DownloadDocumentsPageCaption(context) {
    const { selectedDocuments, documentsList } = libDoc.getDownloadDocumentsDataFromContext(context);

    if (documentsList) {
        const allCount = documentsList.length;
        const selectedCount = selectedDocuments && Object.keys(selectedDocuments).length;
        return allCount === selectedCount || selectedCount === undefined ? context.localizeText('documents_x', [allCount]) : context.localizeText('documents_x_x', [selectedCount, allCount]);
    }

    return context.localizeText('documents');
}
