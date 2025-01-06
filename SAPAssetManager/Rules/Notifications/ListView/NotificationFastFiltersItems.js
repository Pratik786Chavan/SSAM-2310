import NotificationFastFilters from '../../FastFilters/MultiPersonaFilters/NotificationFastFilters';

export default function NotificationFastFiltersItems(context) {
    let NotificationFastFiltersClass = new NotificationFastFilters(context);
    
    return prepareDataForFastFilters(context, NotificationFastFiltersClass).then(() => {
        
        /** 
            to customize the list of fast filters, the getFastFilters method must be overwritten in the NotificationFastFilters class
            getFastFilters returns a list of filter objects
            each object contains:
            for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
            for sortes: caption, value, visible
        */
        return NotificationFastFiltersClass.getFastFilterItemsForListPage(context);
    });
}

function prepareDataForFastFilters(context, NotificationFastFiltersClass) {
    let promises = [];

    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['NotifNum'], '$filter=sap.hasPendingChanges() and sap.entityexists(NotifHeader_Nav)'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotifHeaderLongTexts', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationActivities', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationItems', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationTasks', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationItemActivities', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationItemCauses', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationItemTasks', ['NotificationNumber'], '$filter=sap.hasPendingChanges()'));

    return Promise.all(promises).then(results => {
        let ids = [];

        if (results[0].length) {
            results[0].forEach(result => {
                if (result.NotifNum) {
                    ids.push(`NotificationNumber eq '${result.NotifNum}'`);
                }
            });
        }

        let allResults = new Array().concat(results[1], results[2], results[3], results[4], results[5], results[6], results[7]);
        if (allResults.length) {
            allResults.forEach(result => {
                result.forEach(item => {
                    if (item.NotificationNumber) {
                        ids.push(`NotificationNumber eq '${item.NotificationNumber}'`);
                    }
                });
            });
        }

        context.getPageProxy().getClientData().NotificationFastFiltersClass = NotificationFastFiltersClass;

        if (ids.length) {
            let query = ids.join(' or ');
            NotificationFastFiltersClass.setConfigProperty('modifiedFilterQuery', query);
        }

        return Promise.resolve();
    });
}
