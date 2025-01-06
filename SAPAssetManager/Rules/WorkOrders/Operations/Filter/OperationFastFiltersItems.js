import OperationFastFilters from '../../../FastFilters/MultiPersonaFilters/OperationFastFilters';

export default function OperationFastFiltersItems(context) {
    let OperationFastFiltersClass = new OperationFastFilters(context);

    return prepareDataForFastFilters(context, OperationFastFiltersClass).then(() => {

        /** 
            to customize the list of fast filters, the getFastFilters method must be overwritten in the OperationFastFilters class
            getFastFilters returns a list of filter objects
            each object contains:
            for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
            for sortes: caption, value, visible
         */
        return OperationFastFiltersClass.getFastFilterItemsForListPage(context);
    });
}

function prepareDataForFastFilters(context, OperationFastFiltersClass) {
    let promises = [];

    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['OrderId', 'OperationNo'], '$filter=sap.hasPendingChanges() and sap.entityexists(WOOperation_Nav)'));
    
    if (OperationFastFiltersClass.isConfirmedStatusFilterVisible(context)) {
        promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', ['OrderId', 'OperationNo', 'Confirmations/ConfirmationCounter', 'Confirmations/FinalConfirmation'], '$orderby=Confirmations/ConfirmationCounter desc&$expand=Confirmations&$filter=sap.entityexists(Confirmations) and Confirmations/any(confirmation:confirmation/FinalConfirmation eq \'X\')'));
    }

    return Promise.all(promises).then(results => {
        let ids = [];

        if (results[0].length) {
            results[0].forEach(result => {
                if (result.OrderId && result.OperationNo) {
                    ids.push(`(OrderId eq '${result.OrderId}' and OperationNo eq '${result.OperationNo}')`);
                }
            });
        }

        context.getPageProxy().getClientData().OperationFastFiltersClass = OperationFastFiltersClass;
        if (ids.length) {
            let query = ids.join(' or ');
            OperationFastFiltersClass.setConfigProperty('modifiedFilterQuery', query);
        }

        let confirmedIds = [];
        if (results[1] && results[1].length) {
            results[1].forEach(result => {
                if (result.Confirmations[0].FinalConfirmation === 'X') {
                    confirmedIds.push(`(OrderId eq '${result.OrderId}' and OperationNo eq '${result.OperationNo}')`);
                }
            });
        }
        if (confirmedIds.length) {
            let query = confirmedIds.join(' or ');
            OperationFastFiltersClass.setConfigProperty('confirmedFilterQuery', query);
        }

        return Promise.resolve();
    });
}
