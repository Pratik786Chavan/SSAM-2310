import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function InitialStatusText(context) {
    return GetSystemStatusTextOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/InitialStatus.global').getValue());
}

/**
 * @param {IClientAPI} context
 * @returns {string}
 */
export function GetSystemStatusTextOrEmpty(context, systemStatus) {
    return systemStatus ? context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$filter=SystemStatus eq '${systemStatus}'&$select=StatusText`)
        .then((/** @type {ObservableArray<SystemStatus>} */ systemStatuses) => ValidationLibrary.evalIsEmpty(systemStatuses) ? '' : systemStatuses.getItem(0).StatusText) : Promise.resolve('');  // single element is expected
}
