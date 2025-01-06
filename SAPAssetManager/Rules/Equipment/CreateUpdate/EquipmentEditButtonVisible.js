import EnableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Show/hide edit equipment button based on Persona or User Authorization 
* @param {IClientAPI} context
*/
export default function EquipmentEditButtonVisible(context) {
    if (PersonaLibrary.isWCMOperator(context) || CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Edit') === 'N') {
        return false;
    }

    return EnableAttachmentCreate(context);
}
