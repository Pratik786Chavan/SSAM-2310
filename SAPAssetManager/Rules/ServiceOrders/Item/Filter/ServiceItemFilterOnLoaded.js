
export default function ServiceItemFilterOnLoaded(context) {
    /** @type {import('../GetItemFilters').ServiceItemListPageClientData} */
    const clientData = context.evaluateTargetPath('#Page:ServiceItemsListViewPage/#ClientData');
    clientData.ServiceItemFastFilters.setFastFilterValuesToFilterPage(context);
}
