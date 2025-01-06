import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsTotalSize(context, documentsList, sizeOnly) {
    let list = [];
    if (documentsList) {
        list = documentsList;
    } else {
        const { selectedDocuments } = libDoc.getDownloadDocumentsDataFromContext(context);
        if (selectedDocuments) {
            list = Object.values(selectedDocuments);
        }
    }

    let totalSizeLabel = '0 KB';

    const totalSize = list.reduce((total, doc) => {
        return total += parseInt(doc.FileSize);
    }, 0);

    if (totalSize) {
        totalSizeLabel = libDoc.formatFileSize(totalSize);
    }

    return sizeOnly ? totalSizeLabel : context.localizeText('total_size_x', [totalSizeLabel]);
}
