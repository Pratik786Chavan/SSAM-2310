import isImageFormat from './DocumentEditorIsImageFormat';
import getFileInfo from './DocumentEditorGetFileInfo';
import libCom from '../Common/Library/CommonLibrary';
import DocumentEditorIsAutoResizeEnabled from './DocumentEditorIsAutoResizeEnabled';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentEditorResizeVisible(context) {
    const fileName = context.binding.Document.FileName;
    if (fileName.slice(0,4) === 'Sig_') {
        return false;
    }
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    if (DocumentEditorIsAutoResizeEnabled(context) && navType === 'Attachment') {
        return false;
    }
    const fileInfo = getFileInfo(context);
    if (fileInfo) {
        return isImageFormat(fileInfo.FileName);
    }
    return false;
}
