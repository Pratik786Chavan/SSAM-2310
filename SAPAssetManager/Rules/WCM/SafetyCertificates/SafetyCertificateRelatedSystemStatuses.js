import { LOTOCertificatePreFilters } from './LOTOCertificatesListViewQueryOption';


/** @param {IClientAPI & {binding: import('./LOTOCertificates/LOTOCertificatesFilterNav').LOTOCertificatesListFilterBinding}} context  */
export default function SafetyCertificateRelatedSystemStatuses(context) {
    const allowedStatuses = new Set(((LOTOCertificatePreFilters[context.binding && context.binding.selectedTab] || []).find(c => c.field === 'ActualSystemStatus') || {}).values || []);
    return GetAllSafetyCertificateRelatedSystemStatuses(context, allowedStatuses);
}

function GetAllSafetyCertificateRelatedSystemStatuses(context, allowedStatuses) {
    return (allowedStatuses.size ? Promise.resolve([...allowedStatuses]) : (context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMDocumentHeaders', [], '$select=ActualSystemStatus')
        .then(statuses => [...new Set(statuses.map(i => i.ActualSystemStatus))])))
        .then(uniqueStatuses => context.read('/SAPAssetManager/Services/AssetManager.service', 'SystemStatuses', [], `$select=StatusText,SystemStatus&$filter=${uniqueStatuses.map(s => `(SystemStatus eq '${s}')`).join(' or ')}`))
        .then(sysStatuses => Array.from(sysStatuses, i => ({
            ReturnValue: i.SystemStatus,
            DisplayValue: i.StatusText,
        })));
}
