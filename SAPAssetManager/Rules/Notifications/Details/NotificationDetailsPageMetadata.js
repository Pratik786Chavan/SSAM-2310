import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function NotificationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Notifications/NotificationDetails.page');

    if (IsPhaseModelEnabled(clientAPI)) {
        return await ModifyKeyValueSection(clientAPI, page, 'NotificationDetailsSectionPhaseModel');
    } else {
        return await ModifyKeyValueSection(clientAPI, page, 'NotificationDetailsSection');
    }

}
