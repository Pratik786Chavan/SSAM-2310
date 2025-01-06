import { GetSystemStatusTextOrEmpty } from './InitialStatusText';

export default function TaggedStatusText(context) {
    return GetSystemStatusTextOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Tagged.global').getValue());
}
