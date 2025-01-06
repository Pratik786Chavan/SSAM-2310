import MeasuringPointFDCIsVisible from './MeasuringPointFDCIsVisible';
import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import EnableNotificationEdit from '../../UserAuthorizations/Notifications/EnableNotificationEdit';

export default function MeasuringPointsTakeReadingsIsVisible(clientAPI, actionBinding) {
    
    return MeasuringPointFDCIsVisible(clientAPI, actionBinding).then(isReadingEnabled => {
        if (isReadingEnabled) {
            const dataType = clientAPI.getPageProxy().binding['@odata.type'];

            if (dataType === clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue()) {
                return EnableNotificationEdit(clientAPI).then(isEditEnabled => {
                    return isEditEnabled;
                });
            }

            return EnableWorkOrderEdit(clientAPI).then(isEditEnabled => {
                return isEditEnabled;
            });
        }

        return false;
    });
}
