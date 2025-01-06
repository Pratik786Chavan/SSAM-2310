import EnableNotificationCreate from '../../UserAuthorizations/Notifications/EnableNotificationCreate';
import DocumentsIsVisible from '../../Documents/DocumentsIsVisible';
import IsWCMOperator from '../IsWCMOperator';

export default function WCMQABDetailsPageIsVisible(context) {
    return IsWCMOperator(context) && (EnableNotificationCreate(context) || DocumentsIsVisible(context));
}
