import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCommon from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function NotificationItemTaskDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();

    return NotificationItemTaskChangeStatusOptions(context, actionBinding).then(items => {
        return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'NotificationItemTaskDetailsPage').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemTaskDetailsNav.action');
        });
    });
}

export function NotificationItemTaskChangeStatusOptions(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/ItemTaskMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
        //Save mobile status in the page's client data using key 'PhaseModelRollbackStatus'
        libCommon.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0));

        let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${PersonaLibrary.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/ItemTaskMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions).then(codes => {
            let popoverItems = [];

            codes.forEach(element => {
                let statusElement = element.NextOverallStatusCfg_Nav;

                let transitionType = element.TransitionType || '';
                let transitionText;

                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                if (statusElement.TransitionTextKey) {
                    transitionText = context.localizeText(statusElement.TransitionTextKey);
                } else {
                    transitionText = statusElement.OverallStatusLabel;
                }

                popoverItems.push({ 'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/Notifications/MobileStatus/ItemTaskChangeStatus.js', 'TransitionType': transitionType });
            });

            return popoverItems;
        });
    });
}
