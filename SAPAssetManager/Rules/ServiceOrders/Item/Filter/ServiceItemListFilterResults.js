import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

/** @param {IControlProxy} context */
export default function ServiceItemListFilterResults(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const [sortFilter, typeListpicker] = ['SortFilter', 'TypeLstPicker'].map(controlName => formCellContainer.getControl(controlName).getValue());
    const statusListpicker = formCellContainer.getControl('MobileStatusFilter').getFilterValue();

    let filterResults = [sortFilter, statusListpicker];

    if (!ValidationLibrary.evalIsEmpty(typeListpicker)) {
        typeListpicker.forEach(filter => {
            filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, filter.DisplayValue, [filter.ReturnValue], true, undefined, [filter.DisplayValue]));
        });
    }

    /** @type {import('../GetItemFilters').ServiceItemListPageClientData} */
    const clientData = context.evaluateTargetPath('#Page:ServiceItemsListViewPage/#ClientData');
    if (clientData.ServiceItemFastFilters) {
        filterResults = filterResults.concat(clientData.ServiceItemFastFilters.getFastFilterValuesFromFilterPage(context, statusListpicker.filterItems));
    }

    return filterResults.flat().filter(fCriteria => !ValidationLibrary.evalIsEmpty(fCriteria));
}
