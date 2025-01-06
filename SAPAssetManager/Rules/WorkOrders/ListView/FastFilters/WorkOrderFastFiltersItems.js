import WOFastFilters from '../../../FastFilters/MultiPersonaFilters/WOFastFilters';

export default function WorkOrderFastFiltersItems(context) {
    let WOFastFiltersClass = new WOFastFilters(context);

    return prepareDataForFastFilters(context, WOFastFiltersClass).then(() => {

        /** 
            to customize the list of fast filters, the getFastFilters method must be overwritten in the WOFastFilters class
            getFastFilters returns a list of filter objects
            each object contains:
            for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
            for sortes: caption, value, visible
         */
        return WOFastFiltersClass.getFastFilterItemsForListPage(context);
    });
}

function prepareDataForFastFilters(context, WOFastFiltersClass) {
    let promises = [];

    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaderLongTexts', ['OrderId'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['OrderId'], '$filter=sap.hasPendingChanges() and sap.entityexists(WOHeader_Nav)'));

    return Promise.all(promises).then(results => {
        let ids = [];

        if (results[0].length) {
            results[0].forEach(result => {
                if (result.OrderId) {
                    ids.push(`OrderId eq '${result.OrderId}'`);
                }
            });
        }

        if (results[1].length) {
            results[1].forEach(result => {
                if (result.OrderId) {
                    ids.push(`OrderId eq '${result.OrderId}'`);
                }
            });
        }

        context.getPageProxy().getClientData().WOFastFiltersClass = WOFastFiltersClass;

        if (ids.length) {
            let query = ids.join(' or ');
            WOFastFiltersClass.setConfigProperty('modifiedFilterQuery', query);
        }

        return Promise.resolve();
    });
}
