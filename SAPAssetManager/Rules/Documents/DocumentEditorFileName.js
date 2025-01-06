
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorFileName(context, encode = false) {
    const fileInfo = getFileInfo(context) || context.binding.Document;
    return encode ? encodeURIComponent(fileInfo.FileName) : fileInfo.FileName;
}
