
export default function SubOperationsListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:MySubOperationsFilter/#Value');

    let filterResults = [result1, result2, result3];

    let clientData = context.evaluateTargetPath('#Page:SubOperationsListViewPage/#ClientData');
    if (clientData.SubOperationFastFiltersClass) {
        filterResults = filterResults.concat(clientData.SubOperationFastFiltersClass.getFastFilterValuesFromFilterPage(context, result2.filterItems));
    }

    return filterResults;
}
