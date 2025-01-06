import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import EnableMaintenanceTechnician from './EnableMaintenanceTechnician';
import IsWCMOperator from '../WCM/IsWCMOperator';

export default function EnableCreateNotificationFromSideMenu(clientAPI) {
    return (EnableMaintenanceTechnician(clientAPI) || IsWCMOperator(clientAPI)) && EnableNotificationCreate(clientAPI);
}
