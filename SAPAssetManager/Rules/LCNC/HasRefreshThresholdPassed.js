import CommonLibrary from '../Common/Library/CommonLibrary';

export default function HasRefreshThresholdPassed(context) {
    let thresholdPeriodParam = context.getGlobalDefinition('/SAPAssetManager/Globals/LCNC/MetadataRefreshThresholdParameter.global').getValue();
    let lcncParamGroup = context.getGlobalDefinition('/SAPAssetManager/Globals/LCNC/LCNCParamGroup.global').getValue();
    let thresholdPeriod = CommonLibrary.getAppParam(context, lcncParamGroup, thresholdPeriodParam);
    let lastRefreshTime = CommonLibrary.getStateVariable(context, 'lastMetadataRefreshTime');

    return CommonLibrary.hasThresholdPassed(lastRefreshTime, thresholdPeriod);
}
