
/** @param {IPageProxy} context */
export default function OperationalItemsTabPreFilters(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'WCMDocumentHeaders/Priority', 'SortFilter', ['WCMDocumentHeaders/Priority'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('related_safety_certificate_priority')])];
}
