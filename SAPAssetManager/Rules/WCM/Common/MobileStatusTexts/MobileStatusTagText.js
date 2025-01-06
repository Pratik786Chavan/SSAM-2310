import { GetMobileStatusLabelOrEmpty } from './MobileStatusUntagText';

export default function MobileStatusTagText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TagParameterName.global').getValue());
}
