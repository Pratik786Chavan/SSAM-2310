import { OpItemMobileStatusPreFilters } from './OperationalItemsListViewQueryOptions';

/** @param {IPageProxy & {binding: import('./OperationalItemsListFilterNav').OperationalItemsListFilterBinding}} context  */
export default function OperationalItemsStatusesFilter(context) {
    const allowedStatuses = new Set(OpItemMobileStatusPreFilters[context.binding.selectedTab]);
    return GetAllOperationalItemsStatuses(context, allowedStatuses);
}

function GetAllOperationalItemsStatuses(context, allowedStatuses) {
    return GetMobileStatusMappingsByObjectType(context, 'WCMDOCITEM', allowedStatuses)
        .then(mobileStatusMappings => [...new Map(mobileStatusMappings.map(mobileStatusMapping => [mobileStatusMapping.MobileStatus, mobileStatusMapping])).values()]  // make the statuses unique
            .map(uniqueMobileStatusMapping => ({
                ReturnValue: uniqueMobileStatusMapping.MobileStatus,
                DisplayValue: uniqueMobileStatusMapping.MobileStatusLabel,
            })));
}

function GetMobileStatusMappingsByObjectType(context, objectType, allowedStatuses) {
    const filter = `$filter=ObjectType eq '${objectType}'${allowedStatuses.size ? ` and (${[...allowedStatuses].map(status => `MobileStatus eq '${status}'`).join(' or ')})` : ''}`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MobileStatusMappings', [], filter);
}
