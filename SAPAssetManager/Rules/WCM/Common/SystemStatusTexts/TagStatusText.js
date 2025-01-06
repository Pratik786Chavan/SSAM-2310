import { GetSystemStatusTextOrEmpty } from './InitialStatusText';

export default function TagStatusText(context) {
    return GetSystemStatusTextOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Tag.global').getValue());
}
