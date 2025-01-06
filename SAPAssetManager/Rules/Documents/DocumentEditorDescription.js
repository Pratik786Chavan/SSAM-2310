import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorDescription(context, encode = false) {
    const description = libCom.getStateVariable(context, 'DocumentEditorDescription') || context.binding.Document.Description;
    return encode ? encodeURIComponent(description) : description;
}
