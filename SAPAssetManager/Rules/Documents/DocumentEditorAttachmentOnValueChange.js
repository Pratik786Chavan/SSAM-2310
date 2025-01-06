import libCom from '../Common/Library/CommonLibrary';
import setFileInfo from './DocumentEditorSetFileInfo';
import attachmentFileName from './DocumentEditorAttachmentFileName';
import saveAttachment from './DocumentEditorSaveAttachment';
import isImageFormat from './DocumentEditorIsImageFormat';

export default function DocumentEditorAttachmentOnValueChange(context) {
    const attachmentCount = context.getValue().length;

    if (!context.getClientData().attachmentCount) {
        context.getClientData().attachmentCount = 0;
    }

    if (attachmentCount > context.getClientData().attachmentCount) {
        const attachment = context.getValue()[attachmentCount - 1];
        const fileName = attachmentFileName(attachment);
        if (isImageFormat(fileName)) {
            context.getClientData().attachmentCount = attachmentCount;
            const directory = saveAttachment(context, attachment, fileName);
            libCom.setStateVariable(context, 'DocumentEditorNavType', 'Attachment');
            setFileInfo(context, {
                FileName: fileName, Directory: directory, IsDeleteAllowed: false,
            });
            // workaround for iOS extension
            context.getPageProxy().setActionBinding({
                'Document': {
                    'FileName': fileName,
                },
            });
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorNav.action');
        }
    }

    context.getClientData().attachmentCount = attachmentCount;
    return Promise.resolve();
}
