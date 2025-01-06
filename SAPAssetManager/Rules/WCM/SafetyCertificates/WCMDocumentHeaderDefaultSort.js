
export default function WCMDocumentHeaderDefaultSort(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Priority', 'SortFilter', ['Priority'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('priority')])];
}
