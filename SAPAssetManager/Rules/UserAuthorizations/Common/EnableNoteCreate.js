/**
* Show/hide Note add button based on parent object and user authorization
* @param {IClientAPI} context
*/
import editNotificaitonEnabled from '../Notifications/EnableNotificationEdit';
import editWorkOrderEnabled from '../WorkOrders/EnableWorkOrderEdit';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function EnableNoteCreate(context) {
     // Enable note creation depending on the entity set
     const entityName = context.binding['@odata.type'].split('.')[1];
     switch (entityName) {
        case 'MyNotificationHeader':
            return (editNotificaitonEnabled(context));
        case 'S4ServiceOrder':
        case 'S4ServiceRequest':
        case 'MyWorkOrderHeader':
            return (editWorkOrderEnabled(context));
        case 'MyFunctionalLocation':
            return false;
        case 'MyEquipment':
            return false;
        case 'PurchaseOrderHeader':
            return false;
        case 'WCMDocumentItem':
            return false;
        case 'S4ServiceConfirmation': 
            return true;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue().split('.')[1]:
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue().split('.')[1]:
            return !libWO.isWorkOrderInCreatedState(context);        
        default:
            return true;
     }
}
