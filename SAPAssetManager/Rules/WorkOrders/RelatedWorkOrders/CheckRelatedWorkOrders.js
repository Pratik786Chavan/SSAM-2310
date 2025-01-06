import deleteMessage from '../../Common/DeleteEntityOnSuccess';

export default function CheckRelatedWorkOrders(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderHistories', [], `$filter=sap.islocal() and OrderId eq '${context.binding.OrderId}' and ReferenceType eq 'P'`).then(function(result) {
        if (result && result.length > 0) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/RelatedWorkOrders/RelatedWorkOrderDiscard.action').then(() => {
                return CheckLinkedHeaderNotification(context);
            });
        } else {
            return CheckLinkedHeaderNotification(context);
        }
    });
}

function CheckLinkedHeaderNotification(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], `$filter=sap.islocal() and OrderId eq '${context.binding.OrderId}'`).then(function(result) {
        if (result && result.length > 0) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateWorkOrderId.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'MyNotificationHeaders',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': result.getItem(0)['@odata.readLink'],
                    },
                    'Properties': {
                        'OrderId': '',
                    },
                    'UpdateLinks': [],
                    'OnSuccess': '/SAPAssetManager/Rules/Common/DeleteEntityOnSuccess.js',
                },
            });
        } else {
            return deleteMessage(context);
        }
    });
}
