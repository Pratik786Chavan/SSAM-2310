import { GetMobileStatusLabelOrEmpty } from './MobileStatusUntagText';

export default function MobileStatusInitialStatusText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/InitialStatusParameterName.global').getValue());
}
