import EnableWorkOrderCreate from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import IsMTGISEnabled from '../Maps/IsMTGISEnabled';

export default function IsQABSectionVisible(context) {
    return EnableWorkOrderCreate(context) || EnableNotificationCreate(context) || TimeSheetsIsEnabled(context) || IsAddConfirmationButtonVisible(context) || IsMTGISEnabled(context);
}
