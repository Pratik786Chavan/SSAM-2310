import { GetMobileStatusLabelOrEmpty } from './MobileStatusUntagText';

export default function MobileStatusTaggedText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue());
}
