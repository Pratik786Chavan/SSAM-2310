import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libPersona from '../../Persona/PersonaLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ObjectCardTertiaryButtonTitle(context) {
    let roletype = CommonLibrary.getStateVariable(context, 'UserRoleType');
    let persona = libPersona.getActivePersona(context);
    let overallStatusSeq_Nav;
    //My Operation Secondary Button
    if (IsOperationLevelAssigmentType(context)) {
        overallStatusSeq_Nav = context.binding.OperationMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    } else {
    //My Work Order Secondary Button
        overallStatusSeq_Nav = context.binding.OrderMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusSeq_Nav;
    }
    for (let x = 0 ; x < overallStatusSeq_Nav.length; x++) {
        if (overallStatusSeq_Nav[x].RoleType === roletype && overallStatusSeq_Nav[x].UserPersona === persona && overallStatusSeq_Nav[x].TransitionType === 'T') {
            let toStatus = overallStatusSeq_Nav[x].NextOverallStatusCfg_Nav.TransitionTextKey ? overallStatusSeq_Nav[x].NextOverallStatusCfg_Nav.TransitionTextKey : overallStatusSeq_Nav[x].NextOverallStatusCfg_Nav.OverallStatusLabel;
            return context.localizeText(toStatus);
        }
    }
    return '';
}
