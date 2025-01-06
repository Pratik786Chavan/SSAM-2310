
export default function FLOCFilteringResult(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, localFilter] = ['SortFilter', 'LocalFilter'].map(n => fcContainer.getControl(n).getValue());
    const wcFilter = fcContainer.getControl('WorkCenterFilter').getFilterValue();
    let filterResults = [sortFilter];

    if (localFilter && localFilter.filterItems.length && localFilter.filterItems[0]) {
        let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, ['sap.islocal()'], true);
        filterResults.push(filter);
    }

    let clientData = context.evaluateTargetPath('#Page:FunctionalLocationListViewPage/#ClientData');
    if (clientData.FunctionalLocationFastFiltersClass) {
        filterResults = filterResults.concat(clientData.FunctionalLocationFastFiltersClass.getFastFilterValuesFromFilterPage(context, wcFilter));
    }

    return filterResults;
}
